import * as React from "react"
import { Tiptap, useEditor, useTiptap, useTiptapState } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import {
    Bold,
    Italic,
    Strikethrough,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    Quote,
    Undo,
    Redo,
} from "lucide-react"
import { cn } from "@/lib/utils"

function ToolbarButton({
    onClick,
    isActive,
    disabled = false,
    ariaLabel,
    children,
}: {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    ariaLabel?: string
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            aria-label={ariaLabel}
            onClick={(e) => {
                e.preventDefault()
                onClick()
            }}
            disabled={disabled}
            className={cn(
                "p-1.5 rounded-md transition-colors duration-200 flex items-center justify-center",
                isActive
                    ? "bg-gold/20 text-gold"
                    : "text-white/60 hover:text-white hover:bg-white/10",
                disabled && "opacity-30 cursor-not-allowed hover:text-white/60 hover:bg-transparent"
            )}
        >
            {children}
        </button>
    )
}

function MenuBar() {
    const { editor } = useTiptap()

    // Use useTiptapState to grab all formatting states efficiently
    const activeStates = useTiptapState((state) => ({
        bold: state.editor.isActive("bold"),
        italic: state.editor.isActive("italic"),
        strike: state.editor.isActive("strike"),
        heading1: state.editor.isActive("heading", { level: 1 }),
        heading2: state.editor.isActive("heading", { level: 2 }),
        heading3: state.editor.isActive("heading", { level: 3 }),
        bulletList: state.editor.isActive("bulletList"),
        orderedList: state.editor.isActive("orderedList"),
        blockquote: state.editor.isActive("blockquote"),
    }))

    if (!editor) {
        return null
    }

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-white/5 rounded-t-lg">
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={activeStates.bold}
                ariaLabel="Bold"
            >
                <Bold className="w-4 h-4" aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={activeStates.italic}
                ariaLabel="Italic"
            >
                <Italic className="w-4 h-4" aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={activeStates.strike}
                ariaLabel="Strike"
            >
                <Strikethrough className="w-4 h-4" aria-hidden="true" />
            </ToolbarButton>

            <div className="w-px h-5 bg-white/10 mx-1" />

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={activeStates.heading1}
                ariaLabel="Heading 1"
            >
                <Heading1 className="w-4 h-4" aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={activeStates.heading2}
                ariaLabel="Heading 2"
            >
                <Heading2 className="w-4 h-4" aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={activeStates.heading3}
                ariaLabel="Heading 3"
            >
                <Heading3 className="w-4 h-4" aria-hidden="true" />
            </ToolbarButton>

            <div className="w-px h-5 bg-white/10 mx-1" />

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={activeStates.bulletList}
                ariaLabel="Bullet List"
            >
                <List className="w-4 h-4" aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={activeStates.orderedList}
                ariaLabel="Ordered List"
            >
                <ListOrdered className="w-4 h-4" aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={activeStates.blockquote}
                ariaLabel="Block quote"
            >
                <Quote className="w-4 h-4" aria-hidden="true" />
            </ToolbarButton>

            <div className="flex-1" />

            <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                ariaLabel="Undo"
            >
                <Undo className="w-4 h-4" aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                ariaLabel="Redo"
            >
                <Redo className="w-4 h-4" aria-hidden="true" />
            </ToolbarButton>
        </div>
    )
}

export interface RichTextEditorProps {
    content?: string
    onChange?: (html: string) => void
    className?: string
}

export function RichTextEditor({
    content = "",
    onChange,
    className,
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class:
                    "prose prose-invert max-w-none p-4 min-h-[150px] focus:outline-none text-white/80",
            },
        },
    })

    if (!editor) {
        return (
            <div
                className={cn(
                    "border border-white/15 rounded-lg overflow-hidden bg-[#0d0b08]/80 backdrop-blur-md",
                    className
                )}
            >
                <div className="p-4 text-white/40 flex items-center justify-center animate-pulse min-h-[150px]">
                    Initializing Editor...
                </div>
            </div>
        )
    }

    return (
        <div
            className={cn(
                "border border-white/15 rounded-lg overflow-hidden bg-[#0d0b08]/80 backdrop-blur-md focus-within:border-gold/50 transition-colors",
                className
            )}
        >
            <Tiptap editor={editor}>
                <MenuBar />
                <Tiptap.Content />
            </Tiptap>
        </div>
    )
}

import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChevronRight,
  Search,
} from 'lucide-react'

interface TreeNode {
  name: string
  children?: TreeNode[]
}

const TREE: TreeNode[] = [
  {
    name: 'Design',
    children: [
      { name: 'Web Apps' },
      {
        name: 'CRM Apps',
        children: [
          { name: 'Desktop Apps' },
          { name: 'Mobile Apps' },
        ],
      },
      { name: 'Backup Files' },
      { name: 'Documents' },
      { name: 'Applications' },
      { name: 'Archives' },
    ],
  },
]

const variants = {
  hidden: { height: 0, opacity: 0, transition: { duration: 0.2 } },
  visible: { height: 'auto', opacity: 1, transition: { duration: 0.2 } },
}

export function FileTreeSidebar() {
  const [open, setOpen] = useState<Record<string, boolean>>({})

  const toggle = (name: string) =>
    setOpen((prev) => ({ ...prev, [name]: !prev[name] }))

  const renderNode = (node: TreeNode, depth = 0) => {
    const hasKids = !!node.children?.length
    const isOpen = open[node.name]

    return (
      <li key={node.name}>
        <div
          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/[0.08] cursor-pointer"
          style={{ paddingLeft: depth * 16 + 8 }}
          onClick={() => hasKids && toggle(node.name)}
        >
          {hasKids ? (
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="h-4 w-4"
            >
              <ChevronRight className="h-4 w-4 text-white/60" />
            </motion.div>
          ) : (
            <div className="w-4" />
          )}
          <span className=' text-[#ffa71a]'>
            <svg className="h-5 w-5 size-6 shrink-0 text-warning dark:text-warning-light ltr:mr-3 rtl:ml-3" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 20 20" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path></svg>
          </span>
          <span className="truncate text-sm text-white">{node.name}</span>
        </div>

        {hasKids && (
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.ul
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={variants}
                className="mt-1 space-y-1 overflow-hidden"
              >
                {node.children!.map((child) => renderNode(child, depth + 1))}
              </motion.ul>
            )}
          </AnimatePresence>
        )}
      </li>
    )
  }

  return (
    <Card className="bg-transparent backdrop-blur-md p-4 pb-16 rounded-3xl">
      {/* Header */}
      <CardTitle className="text-sm pl-2 pt-1">Archivos</CardTitle>
      <div className="relative mt-0 mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
        <Input
          placeholder="Search..."
          className="pl-10 bg-white/[0.05] text-white"
        />
      </div>

      {/* Tree */}
      <ScrollArea>
        <ul className="space-y-1">
          {TREE.map((root) => renderNode(root))}
        </ul>
      </ScrollArea>
    </Card>
  )
}
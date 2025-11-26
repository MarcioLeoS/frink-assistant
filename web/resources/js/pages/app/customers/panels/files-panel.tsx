import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    Folder,
    FileText,
    FileSpreadsheet,
    ImageIcon,
    FilePlus2,
    List,
    Grid,
    MoreHorizontal,
} from 'lucide-react'

type FileType = 'folder' | 'pdf' | 'xlsx' | 'jpg' | 'pptx'

const ITEMS: Array<{
    id: number
    name: string
    size: string
    type: FileType
}> = [
        { id: 1, name: 'Project_Files', size: '21.8 MB', type: 'folder' },
        { id: 2, name: 'Documents', size: '10.5 MB', type: 'folder' },
        { id: 3, name: 'Team_Resources', size: '783.1 kB', type: 'folder' },
        { id: 4, name: 'Client_Data', size: '5.4 MB', type: 'folder' },
        { id: 5, name: 'Backup_Files', size: '2.5 MB', type: 'folder' },
        { id: 6, name: 'Tech_design.pdf', size: '2.2 MB', type: 'pdf' },
        { id: 7, name: 'Financial_Report.xlsx', size: '1.5 MB', type: 'xlsx' },
        { id: 8, name: 'Modern_Laputa.jpg', size: '139.2 kB', type: 'jpg' },
        { id: 9, name: 'Project_Presentation.pptx', size: '3.1 MB', type: 'pptx' },
    ]

const ICON_MAP: Record<FileType, { icon: React.ReactNode; color: string }> = {
    folder: {
        icon: <span className=' text-[#ffa71a]'>
            <svg className="h-5 w-5 size-6 shrink-0 text-warning dark:text-warning-light ltr:mr-3 rtl:ml-3" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 20 20" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path></svg>
        </span>, 
        color: 'text-yellow-400'
    },
    pdf: {
        icon: <FileText className="h-6 w-6" />,
        color: 'text-rose-400',
    },
    xlsx: {
        icon: <FileSpreadsheet className="h-6 w-6" />,
        color: 'text-green-400',
    },
    jpg: {
        icon: <ImageIcon className="h-6 w-6" />,
        color: 'text-amber-400',
    },
    pptx: {
        icon: <FilePlus2 className="h-6 w-6" />,
        color: 'text-orange-400',
    },
}

export default function FilesPanel() {
    const [view, setView] = useState<'grid' | 'list'>('grid')
    const [query, setQuery] = useState('')

    const filtered = ITEMS.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
    )

    return (
        <div className="flex h-full flex-col p-4 min-w-full">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">File Manager</h2>
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Buscar archivos..."
                        className="w-64 bg-white/5 text-white"
                        value={query}
                        onChange={e => setQuery(e.currentTarget.value)}
                    />
                    <Button
                        variant={view === 'grid' ? 'default' : 'ghost'}
                        size="icon"
                        onClick={() => setView('grid')}
                    >
                        <Grid className="h-5 w-5 text-white/70" />
                    </Button>
                    <Button
                        variant={view === 'list' ? 'default' : 'ghost'}
                        size="icon"
                        onClick={() => setView('list')}
                    >
                        <List className="h-5 w-5 text-white/70" />
                    </Button>
                    <Button size="sm">Upload</Button>
                </div>
            </div>

            <Card className="flex-1 bg-transparent border-none overflow-hidden">
                {view === 'grid' ? (
                    <CardContent className="p-4">
                        <ScrollArea className="h-full">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {filtered.map(f => {
                                    const meta = ICON_MAP[f.type]
                                    return (
                                        <div
                                            key={f.id}
                                            className="group flex cursor-pointer items-center gap-3 rounded-lg bg-white/[0.02] p-4 transition hover:bg-white/[0.08]"
                                        >
                                            <div className={`${meta.color}`}>{meta.icon}</div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="truncate text-sm text-white">
                                                    {f.name}
                                                </p>
                                                <p className="mt-1 text-xs text-white/50">
                                                    {f.size}
                                                </p>
                                            </div>
                                            <Button size="icon" variant="ghost">
                                                <MoreHorizontal className="h-5 w-5 text-white/50" />
                                            </Button>
                                        </div>
                                    )
                                })}
                            </div>
                        </ScrollArea>
                    </CardContent>
                ) : (
                    <CardContent className="p-0">
                        <ScrollArea className="h-full custom-scroll">
                            <table className="w-full table-auto border-separate border-spacing-0">
                                <thead className="bg-white/[0.04]">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs text-white/60">
                                            File
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs text-white/60">
                                            Size
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs text-white/60">
                                            Type
                                        </th>
                                        <th className="px-4 py-2" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {filtered.map(f => {
                                        const meta = ICON_MAP[f.type]
                                        return (
                                            <tr
                                                key={f.id}
                                                className="hover:bg-white/[0.02] transition-colors"
                                            >
                                                <td className="px-4 py-3 flex items-center gap-2">
                                                    <div className={`${meta.color}`}>{meta.icon}</div>
                                                    <span className="text-sm text-white">{f.name}</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-white/50">
                                                    {f.size}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge variant="outline" className="text-xs capitalize">
                                                        {f.type === 'folder'
                                                            ? 'Folder'
                                                            : f.type.toUpperCase()}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-5 w-5 text-white/50" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </ScrollArea>
                    </CardContent>
                )}
            </Card>
        </div>
    )
}

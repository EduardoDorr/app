import { FileDown, MoreHorizontal, Plus, Search } from 'lucide-react'
import { Header } from './components/header'
import { Tabs } from './components/tabs'
import { Button } from './components/ui/button'
import { Control, Input } from './components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table'
import { Pagination } from './components/pagination'
import { useQuery } from '@tanstack/react-query'


export interface TagResponse {
  first: number
  prev: number | null
  next: number
  last: number
  pages: number
  items: number
  data: Tag[]
}

export interface Tag {
  title: string
  amountOfVideos: number
  id: string
}

export function App() {
  const { data: tagsResponse, isLoading } = useQuery<TagResponse>({
    queryKey: ['get-tags'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3333/tags?_page=1&_per_page=10');
      const data = await response.json();

      return data;
    }
  })

  if (isLoading) {
    return null;
  }

  return (
    <div className="py-10 space-y-8">
      <div>
        <Header />
        <Tabs />
      </div>
      <main className="max-w-6xl mx-auto space-y-5">
        <div className='flex items-center gap-3'>
          <h1 className="text-xl font-bold">Tags</h1>
          <Button className='inline-flex items-center gap-1.5 text-xs bg-teal-300 text-teal-950 font-medium rounded-full px-1.5 py-1'>
            <Plus className='size-3' />
            Create new
          </Button>
        </div>

        <div className='flex items-center justify-between'>
          <Input variant='filter'>
            <Search className='size-3'></Search>
            <Control placeholder='Search tags...'></Control>
          </Input>

          <Button>
            <FileDown className='size-3'></FileDown>
            Export
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Amunt of videos</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tagsResponse?.data.map((tag) => {
              return (
                <TableRow key={tag.id}>
                  <TableCell></TableCell>
                  <TableCell>
                    <div className='flex flex-col'>
                      <span className='font-medium'>{tag.title}</span>
                      <span className='text-xs text-zinc-500>'>{tag.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className='text-zinc-300'>
                    {tag.amountOfVideos} video(s)
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button size='icon'>
                      <MoreHorizontal className='size-4'></MoreHorizontal>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>


        {tagsResponse && <Pagination pages={tagsResponse.pages} items={tagsResponse.items} page={tagsResponse.next - 1} />}
      </main>
    </div>
  )
}
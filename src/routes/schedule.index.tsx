import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/schedule/')({
  component: RouteComponent,
})

// TODO: show tournament bracket with placeholders for week 4
// TODO: add to action bar
function RouteComponent() {
  return <div>Hello "/schedule/"!</div>
}

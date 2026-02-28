import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about/')({
  component: RouteComponent,
})

// TODO: How the app works and the schedule (weeks 1-3, week 4 round 1,2)
// How steps are tracked and synced from StepUp, week is locked ~12 hours after end date
// TODO: Add how scoring works
// TODO: made with love @ james

// TODO: Show same content in a dialog when the user first loads the app

// TODO: accessible from header?
function RouteComponent() {
  return <div>Hello "/about/"!</div>
}

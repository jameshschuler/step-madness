import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import Header from '../components/Header'

import TanStackQueryProvider from '../integrations/tanstack-query/root-provider'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

import { Link } from '@tanstack/react-router'

export function ActionBar() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-4 z-50">
      {/* Dashboard Link */}
      <Link
        to="/"
        activeProps={{ className: 'text-blue-600' }}
        inactiveProps={{ className: 'text-gray-400' }}
        className="font-bold transition-colors"
      >
        Dashboard
      </Link>

      {/* Leaderboard Link */}
      <Link
        to="/leaderboard"
        activeProps={{ className: 'text-blue-600' }}
        inactiveProps={{ className: 'text-gray-400' }}
        className="font-bold transition-colors"
      >
        Leaderboard
      </Link>

      {/* Teams Link */}
      <Link
        to="/teams"
        activeProps={{ className: 'text-blue-600' }}
        inactiveProps={{ className: 'text-gray-400' }}
        className="font-bold transition-colors"
      >
        Teams
      </Link>
    </footer>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <TanStackQueryProvider>
          <Header />
          <div className="flex flex-col min-h-screen bg-gray-50 p-4 font-sans">
            {children}
            <ActionBar />
          </div>
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        </TanStackQueryProvider>
        <Scripts />
      </body>
    </html>
  )
}

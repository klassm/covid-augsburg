import React, { FunctionComponent } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RegionList } from "./region/RegionList";

const queryClient = new QueryClient()

export const App: FunctionComponent = () =>
  (
    <QueryClientProvider client={ queryClient }>
      <RegionList/>
    </QueryClientProvider>
  )

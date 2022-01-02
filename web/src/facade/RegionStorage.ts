import { uniq } from 'lodash';
import { useMutation, useQuery, UseMutationResult } from "react-query";
import { useQueryClient } from 'react-query';

const defaultRegions = ['09761', '09772'];
const userRegionsQueryKey = "user-regions";
const localStorageKey = "covid-history-rs";

export function useUserRegions() {
  return useQuery(userRegionsQueryKey, getUserRegions)
}

function saveRegions(rs: string[]) {
  window.localStorage.setItem(localStorageKey, JSON.stringify(rs));
}

export function useAddRegion(): UseMutationResult<void, unknown, { rs: string }> {
  const queryClient = useQueryClient()

  return useMutation<void, unknown, { rs: string }>(async ({ rs }) => {
    const regions: string[] = uniq([...getUserRegions(), rs]);
    await saveRegions(regions);
  }, {
    onSettled: () => queryClient.invalidateQueries(userRegionsQueryKey)
  })
}

export function useRemoveRegion(): UseMutationResult<void, unknown, { rs: string }> {
  const queryClient = useQueryClient()
  return useMutation<void, unknown, { rs: string }>(async ({ rs: toRemove }) => {
    const newRegions = getUserRegions().filter(rs => toRemove !== rs);
    saveRegions(newRegions);
  }, {
    onSettled: () => queryClient.invalidateQueries(userRegionsQueryKey)
  })
}

export function useSetRegions(): UseMutationResult<void, unknown, { newRegions: string[] }> {
  const queryClient = useQueryClient()
  return useMutation<void, unknown, { newRegions: string[] }>(async ({ newRegions }) => {
    saveRegions(newRegions);
  }, {
    onSettled: () => queryClient.invalidateQueries(userRegionsQueryKey)
  })
}

function getUserRegions(): string[] {
  const value = window.localStorage.getItem(localStorageKey);
  if (!value) {
    return defaultRegions;
  }
  return JSON.parse(value) as string[];
}

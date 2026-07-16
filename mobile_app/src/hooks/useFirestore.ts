import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchBusinesses,
  fetchEvents,
  fetchMarketplaceItems,
  fetchHouseListings,
  fetchMyListings,
  fetchMyEventOrders,
  fetchMyTicketOrders,
  fetchAttendedEvents,
  createDoc,
  updateDocById,
  deleteDocById,
  createReview,
  createTicketOrder,
} from '@/services/firestore';
import { useAuth } from '@/context/AuthContext';

const CACHE = {
  businesses: { staleTime: 5 * 60 * 1000, gcTime: 30 * 60 * 1000 },
  events: { staleTime: 5 * 60 * 1000, gcTime: 30 * 60 * 1000 },
  marketplace: { staleTime: 3 * 60 * 1000, gcTime: 15 * 60 * 1000 },
  house_listings: { staleTime: 5 * 60 * 1000, gcTime: 30 * 60 * 1000 },
  reviews: { staleTime: 2 * 60 * 1000, gcTime: 10 * 60 * 1000 },
  users: { staleTime: 10 * 60 * 1000, gcTime: 60 * 60 * 1000 },
};

export function useBusinesses(state?: string) {
  return useQuery({
    queryKey: ['businesses', state],
    queryFn: () => fetchBusinesses(state),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => fetchEvents(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useMarketplaceItems() {
  return useQuery({
    queryKey: ['marketplace'],
    queryFn: () => fetchMarketplaceItems(),
    staleTime: 3 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

export function useHouseListings() {
  return useQuery({
    queryKey: ['house_listings'],
    queryFn: () => fetchHouseListings(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useMyListings(userId: string | null) {
  return useQuery({
    queryKey: ['myListings', userId],
    queryFn: () => fetchMyListings(userId!),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useMyEventOrders(userId: string | null, eventIds: string[]) {
  return useQuery({
    queryKey: ['myEventOrders', userId, eventIds.sort().join(',')],
    queryFn: () => fetchMyEventOrders(userId!, eventIds),
    enabled: !!userId && eventIds.length > 0,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useMyTicketOrders(userId: string | null) {
  return useQuery({
    queryKey: ['myTicketOrders', userId],
    queryFn: () => fetchMyTicketOrders(userId!),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useAttendedEvents(userId: string | null, eventIds: string[]) {
  return useQuery({
    queryKey: ['attendedEvents', userId, eventIds.sort().join(',')],
    queryFn: () => fetchAttendedEvents(userId!, eventIds),
    enabled: !!userId && eventIds.length > 0,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useReviews(targetId: string | null) {
  return useQuery({
    queryKey: ['reviews', targetId],
    queryFn: () => fetchReviews(targetId!),
    enabled: !!targetId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Mutations with cache invalidation
export function useCreateDoc(collectionName: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => createDoc(collectionName, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [collectionName] });
      qc.invalidateQueries({ queryKey: ['myListings'] });
    },
  });
}

export function useUpdateDoc(collectionName: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateDocById(collectionName, id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [collectionName] });
      qc.invalidateQueries({ queryKey: ['myListings'] });
    },
  });
}

export function useDeleteDoc(collectionName: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDocById(collectionName, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [collectionName] });
      qc.invalidateQueries({ queryKey: ['myListings'] });
    },
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => createReview(data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['reviews', variables.targetId] });
    },
  });
}

export function useCreateTicketOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => createTicketOrder(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myTicketOrders'] });
      qc.invalidateQueries({ queryKey: ['myEventOrders'] });
      qc.invalidateQueries({ queryKey: ['ticket_orders'] });
    },
  });
}
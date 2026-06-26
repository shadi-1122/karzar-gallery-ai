import { create } from "zustand";

export type Photo = {
  _id: string;
  imageUrl: string;
  score?: number;
  width: number;
  height: number;
};

type SearchStore = {
  selfie: Blob | null;
  photos: Photo[];
  loading: boolean;

  setSelfie: (selfie: Blob | null) => void;
  setPhotos: (photos: Photo[]) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
};

export const useSearchStore = create<SearchStore>((set) => ({
  selfie: null,
  photos: [],
  loading: false,

  setSelfie: (selfie) => set({ selfie }),

  setPhotos: (photos) => set({ photos }),

  setLoading: (loading) => set({ loading }),

  reset: () =>
    set({
      selfie: null,
      photos: [],
      loading: false,
    }),
}));

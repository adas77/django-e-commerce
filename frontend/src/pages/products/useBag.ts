import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

type State = {
  products: Record<number, number>;
};

type Action = {
  setProductQuantity: (productId: number, quantity: number) => void;
};

const useBag = create<State & Action>()(
  devtools(
    persist(
      (set) => ({
        products: {},
        setProductQuantity: (productId, quantity) => {
          set((state) => {
            const updatedProducts = { ...state.products };
            if (quantity <= 0) {
              delete updatedProducts[productId];
            } else {
              updatedProducts[productId] = quantity;
            }
            return { products: updatedProducts };
          });
        },
      }),
      {
        name: "__PRODUCTS_TO_ORDER__",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);

export default useBag;

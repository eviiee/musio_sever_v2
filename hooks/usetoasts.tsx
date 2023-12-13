'use client';

import useSWR from "swr";
import { ToastProp } from "../components/layout/toast";

let state: {value : ToastProp[]} = {value : []}

export const useToast = () => {
    const { data, mutate } = useSWR<{value : ToastProp[]}>("toasts", () => state);

    const addToast = (toast: ToastProp) => {
        let id = Date.now().toString();
        state = {...state, value : [...state.value, {...toast, id}]};
        mutate(state);
    }

    const removeToast = (id : string) => {
        state = {...state, value : state.value.filter((toast) => toast.id !== id)}
        mutate(state);
    }

    return {
        toasts: (data ?? state).value,
        addToast,
        removeToast
    }
}
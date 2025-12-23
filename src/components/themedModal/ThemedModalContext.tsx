import { createContext, useContext, useState, ReactNode } from 'react';
import { ThemedModal } from '@/src/components/themedModal/ThemedModal';
import { ModalOptions } from '@/src/components/themedModal/types/ModalOptions';


type ModalContextValue = {
    showModal: (options: ModalOptions) => void;
    closeModal: () => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export function ThemedModalProvider({ children }: { children: ReactNode }) {
    const [modal, setModal] = useState<ModalOptions | null>(null);

    const showModal = (options: ModalOptions) => {
        setModal(options);
    };

    const closeModal = () => {
        setModal(null);
    };

    return (
        <ModalContext.Provider value={{ showModal, closeModal }}>
            {children}
            <ThemedModal visible={!!modal} onClose={closeModal}>
                {modal?.children}
            </ThemedModal>
        </ModalContext.Provider>
    );
}

export function useModal() {
    const ctx = useContext(ModalContext);
    if (!ctx) {
        throw new Error('useModal must be used within ThemedModalProvider');
    }
    return ctx;
}

import { createContext, useContext, useState } from "react";

interface PriceTypeContextType {
    priceType: "monthly" | "yearly";
    setPriceType: (priceType: "monthly" | "yearly") => void;
    formatPriceType: (price: number, originalType: "monthly" | "yearly") => number | string;
};

const PriceTypeContext = createContext<PriceTypeContextType | undefined>(undefined);

function PriceTypeProvider({ children }: { children: React.ReactNode }) {
    const [priceType, setPriceType] = useState<"monthly" | "yearly">("monthly");

    function formatPriceType (price: number, originalType: "monthly" | "yearly") {
        if (price < 0 || typeof price !== "number") return "N/A";
        if (!originalType) return price.toString();

        const preparedPrice = originalType === priceType ? price : priceType === "monthly" ? price / 12: price * 12;
        return preparedPrice;

    };
    return (
        <PriceTypeContext.Provider value={{ priceType, setPriceType, formatPriceType }}>
            {children}
        </PriceTypeContext.Provider>
    );
}

function usePriceType() {
    const context = useContext(PriceTypeContext);
    if (context === undefined) {
        throw new Error("usePriceType must be used within a PriceTypeProvider");
    }
    return context;
}

export { PriceTypeProvider, usePriceType };
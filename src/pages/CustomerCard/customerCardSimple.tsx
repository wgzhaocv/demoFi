import { CustomerInfo } from "@/TestData/fakeData";

type CustommerCardSimpleProps = {
    customer: CustomerInfo;
};

export const CustomerCardSimple: React.FC<CustommerCardSimpleProps> = ({customer}:CustommerCardSimpleProps) => {
    customer;
    return (
        <div>
        <h1>Customer Card Simple</h1>
        </div>
    );
}
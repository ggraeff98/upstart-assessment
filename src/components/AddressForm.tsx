export type AddressFormData = {
  address: string;
};

type Props = {
  onSubmit: (data: AddressFormData) => void;
  initialData?: Partial<AddressFormData>;
};

export default function AddressForm({ onSubmit, initialData = {} }: Props) {
  return (
    <form
      className="flex-col sm:flex-row flex gap-3 p-4 bg-brand-50 rounded-2xl shadow-md"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const address = (form.elements.namedItem("address") as HTMLInputElement)
          .value;
        onSubmit({ address });
      }}
    >
      <input
        type="text"
        name="address"
        defaultValue={initialData.address || ""}
        placeholder="Enter a U.S. address"
        className="flex-1 border border-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-400 rounded-lg p-3 outline-none transition"
        required
      />
      <button
        type="submit"
        className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg shadow-md transition"
      >
        Get Forecast
      </button>
    </form>
  );
}

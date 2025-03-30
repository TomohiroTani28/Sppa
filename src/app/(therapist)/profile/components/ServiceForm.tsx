// src/app/therapist/profile/components/ServiceForm.tsx
import { useState } from "react";
import { useServices } from "@/app/hooks/api/useServices";
import supabase from "@/app/lib/supabase-client";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";

// Define a type for the service data based on therapist_services table
interface ServiceData {
  name: string;
  description: string;
  price: string; // String in form, parsed to number for DB
}

// Function to update or insert a service
async function updateService({ name, description, price }: ServiceData) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw authError || new Error("User not authenticated");

  const { error } = await supabase
    .from("therapist_services") // Correct table name from schema
    .upsert(
      {
        therapist_id: user.id,
        service_name: name, // Matches DB column name
        description,
        price: parseFloat(price), // Convert to number for DB
      },
      { onConflict: "therapist_id,service_name" } // Unique constraint
    );

  if (error) throw error;
}

const ServiceForm = () => {
  const { services, loading, error } = useServices();
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleServiceNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setServiceName(e.target.value);
  const handleServiceDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => setServiceDescription(e.target.value);
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPrice(e.target.value);

  const handleSubmit = async () => {
    try {
      await updateService({
        name: serviceName,
        description: serviceDescription,
        price,
      });
      // Optionally reset form or show success message
      setServiceName("");
      setServiceDescription("");
      setPrice("");
    } catch (err) {
      console.error("Error updating service:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading services</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Edit Service</h2>
      <div className="mb-4">
        <Input
          value={serviceName}
          onChange={handleServiceNameChange}
          placeholder="Service Name"
          className="mb-2"
        />
        <textarea // Replaced Textarea component with native element
          value={serviceDescription}
          onChange={handleServiceDescriptionChange}
          placeholder="Service Description"
          className="mb-2 w-full p-2 border rounded-md"
        />
        <Input
          type="number"
          value={price} // Fixed from loading
          onChange={handlePriceChange}
          placeholder="Price"
          className="mb-2"
        />
      </div>
      <Button onClick={handleSubmit} className="w-full">
        Save Service
      </Button>
    </div>
  );
};

export default ServiceForm;
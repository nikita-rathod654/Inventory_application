import PageShell from "@/components/page-shell";
import SupplierForm from "@/components/supplier-form";
import { getCurrentUser } from "@/lib/auth";

export default async function NewSupplierPage() {
  await getCurrentUser();

  return (
    <PageShell currentPath="/suppliers" title="Add supplier">
      <SupplierForm />
    </PageShell>
  );
}
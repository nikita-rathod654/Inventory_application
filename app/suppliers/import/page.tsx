import PageShell from "@/components/page-shell";
import SupplierCsvImportForm from "@/components/supplier-csv-import-form";
import { getCurrentUser } from "@/lib/auth";
import { card, secondaryBtn } from "@/lib/ui";
import Link from "next/link";

export default async function ImportSuppliersPage() {
  await getCurrentUser();

  return (
    <PageShell
      currentPath="/suppliers"
      title="Import suppliers"
      description="Add many suppliers at once from a CSV file."
      actions={
        <Link href="/suppliers" className={secondaryBtn}>
          Back
        </Link>
      }
    >
      <div className={`${card} max-w-2xl space-y-6 p-5 sm:p-8`}>
        <SupplierCsvImportForm />

        <div className="border-t border-[#1B1635]/10 pt-5 text-sm text-[#1B1635]/70">
          <p className="font-medium text-[#1B1635]">Columns</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>name</strong> is required (max 100 characters).</li>
            <li><strong>email</strong>, <strong>phone</strong> and <strong>notes</strong> are optional.</li>
            <li>A name that already exists, or repeats in the file, is rejected.</li>
          </ul>
        </div>
      </div>
    </PageShell>
  );
}
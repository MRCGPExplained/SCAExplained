import ConfirmedClient from "./ConfirmedClient";

export default async function ConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ access?: string }>;
}) {
  const { access } = await searchParams;
  const isBeta = access === "beta";
  return <ConfirmedClient isBeta={isBeta} />;
}

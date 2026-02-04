import { hello } from "@app/shared";

export default function Home() {
  const message = hello("world");

  return (
    <main className="container">
      <h1>Web App</h1>
      <p>{message}</p>
    </main>
  );
}

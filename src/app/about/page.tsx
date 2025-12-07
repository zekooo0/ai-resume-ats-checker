import { useEffect, useState } from 'react';

export default function AboutPage() {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    setCounter((prev) => prev + 1);
  });
  return <div>About page</div>;
}

import { useEffect, useState } from "react";

export const useDoOnce = (func: (() => void) | undefined): boolean => {
  const [done, setDone] = useState<boolean>(false);

  useEffect(() => {
    if (!func || done) return;
    func();
    setDone(true);
  }, [func, done, setDone]);

  return done;
};

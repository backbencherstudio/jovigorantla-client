import { useState, useEffect, useRef, useCallback, act } from "react";
import {
  useNavigate,
  useLocation,
  useSearchParams,
  Link,
} from "react-router-dom";
import { api } from "@/lib/axois";
import { Search } from "lucide-react";
import CategoryIcons from "@/components/CategoryIcons";
import ListingItem from "@/components/ListingItem";
import { Input } from "@/components/ui/input";
import LocationWithRadius from "@/components/LocationWithRedius";
import FilterTabs from "@/components/FilterTabs";
import { useLocationContext } from "@/context/LocationContext";
import NoListingsFound from "@/components/NoListingsFound";
import { useIsMobile } from "@/hooks/use-mobile";
import ListingSkeleton from "@/components/ListingSkeleton";
// import useScrollRestoration from "@/hooks/useScrollRestoration";
import { cache } from "@/lib/cache";
import AllCaughtUp from "@/components/AllCaughtUp";
import { Helmet } from "react-helmet-async";

export default function Home({ openModal }) {
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }, []);

  return (
    <main className="min-h-[calc(100vh-110px)] w-full mx-auto max-w-3xl md:max-w-xl xl:max-w-3xl bg-transparent ">
      {/* sm:h-auto */}
      <h1>Home Page is here</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Adipisci qui
        dolores aliquid voluptate perspiciatis esse repudiandae magnam,
        distinctio temporibus, accusantium quis beatae labore in corporis
        doloremque dolorem veniam dolorum sint facilis. Voluptas dolore ab
        molestias voluptatem ex impedit, quae, officiis quas perferendis eius
        cum sequi, at repellat amet possimus? Accusantium officiis ut quaerat
        facere, tempore provident, in laudantium error unde, animi alias? Porro
        consectetur aspernatur nisi architecto aut sapiente laborum deleniti
        dolorem eius. Similique eveniet quaerat, consequuntur impedit expedita
        dolorum quae ipsa totam voluptatum explicabo repellendus architecto
        adipisci doloribus vel vero, earum alias dignissimos sint molestiae iste
        sit? Quos, consequatur. Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Autem, unde, voluptates beatae aperiam necessitatibus
        modi nesciunt veritatis repellendus nam ex, consequuntur rerum
        accusamus? Dignissimos numquam provident impedit reiciendis tempore.
        Dolores minus quas dolore molestias! Aliquid nemo voluptatem laboriosam
        facilis qui nulla, odit inventore doloremque minima debitis assumenda
        voluptates repudiandae quidem. Lorem ipsum dolor sit amet, consectetur
        adipisicing elit. Expedita porro impedit consectetur numquam tempore
        omnis, iusto repudiandae doloremque. Quasi excepturi ab assumenda
        dolores, voluptatem minima quis id eum debitis ipsum cumque sequi nam
        praesentium doloribus modi aut mollitia obcaecati neque itaque aliquam
        eos accusamus omnis facilis? Amet, id. Quae, iure?
      </p>
    </main>
  );
}

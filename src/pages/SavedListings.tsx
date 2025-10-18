import { useAuth } from "@/context/AuthContext";

const SavedListings = () => {
  const {
    user,
    favoritesListings,
    deleteFavoritesListing,
    fetchFavoritesListings,
  } = useAuth();

  // Redirect if no user
  if (!user) return null;

  return (
    <div className="p-2 py-4 pb-0 lg:pb-0 w-full min-h-[calc(100vh-110px)] h-full bg-white flex flex-col justify-between gap-4">
      <div>
        <h1>Saved Listing Title</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
          laudantium similique officia porro, laboriosam in, corporis recusandae
          ratione facilis quibusdam nisi cum eaque officiis temporibus ullam
          nulla, consequuntur ipsam fugiat veniam praesentium nesciunt nihil
          voluptates soluta! Ducimus odit perferendis rerum vitae laborum
          maxime, aperiam omnis ullam, hic repudiandae delectus eum aliquid
          totam officiis, adipisci culpa assumenda. Saepe voluptate laborum sunt
          optio maiores ab non dolor minima exercitationem? Pariatur voluptatem
          itaque, nisi animi exercitationem culpa tempora sint quia inventore
          nihil quaerat, magni maiores similique porro! Aperiam fugiat eum
          officia, corporis aliquam ullam? Officiis fuga incidunt dolores quo
          modi eius dicta, voluptate sapiente quod sed. Quae, reiciendis culpa.
          Eos corrupti voluptatibus esse, eum illum aliquid enim veritatis ad
          voluptatum ipsam molestiae amet nemo odit voluptatem praesentium.
          Rerum, cum ipsum? Corrupti aspernatur placeat obcaecati! Accusamus
          illum adipisci voluptates officiis quae magni pariatur. Dignissimos
          magnam iure fugiat. Ipsam recusandae assumenda nihil aspernatur
          voluptatibus, quas reprehenderit labore, blanditiis cum rem atque
          quaerat, inventore minus quibusdam dignissimos beatae soluta ratione
          exercitationem facilis fugit ea voluptate. Harum ad atque aliquam
          dignissimos similique dolorem nulla. Ea voluptate dolor minus non at
          distinctio quis itaque. Architecto eos expedita debitis. Nisi
          accusamus aliquid ut totam assumenda cum quia, libero placeat.
        </p>
      </div>
    </div>
  );
};

export default SavedListings;

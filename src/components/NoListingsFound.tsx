
const NoListingsFound = () => {
  return (
    <div className="text-center py-8 bg-white rounded-lg">
      <div className="text-4xl mb-4">🔍</div>
      <h3 className="text-lg font-medium">No listings found</h3>
      <p className="text-gray-500">Try adjusting your search or filter criteria</p>
    </div>
  );
};

export default NoListingsFound;

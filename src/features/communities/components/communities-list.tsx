import { CommunityGrid } from './ui/community-card/community-grid';

const communitiySections = [
  {
    filter: 'member_count',
    title: 'Top Communities',
    description: 'Discover the most popular communities on Wetalk',
  },
  {
    filter: 'newest',
    title: 'Latest Communities',
    description: 'Discover the latest communities on Wetalk',
  },
];

const CommunitiesList = () => {
  return (
    <div className="flex flex-col gap-8">
      {communitiySections.map((section) => (
        <section key={section.filter}>
          <div className="mb-8">
            <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent">
              {section.title}
            </h1>
            <p className="text-gray-600">{section.description}</p>
          </div>
          <CommunityGrid filter={section.filter}></CommunityGrid>
        </section>
      ))}
    </div>
  );
};

export default CommunitiesList;

import { CommunityGrid } from './ui/community-card/community-grid';

const communitiySections = [
  {
    filter: 'member_count',
    title: 'Top',
    description: 'Discover the most popular communities on Wetalk',
    gradient: 'from-blue-500 to-indigo-500',
    underlineColor: 'decoration-blue-500',
  },
  {
    filter: 'newest',
    title: 'New',
    description: 'Discover the latest communities on Wetalk',
    gradient: 'from-yellow-400 to-orange-400',
    underlineColor: 'decoration-yellow-400',
  },
];

const CommunitiesList = () => {
  return (
    <div className="flex flex-col gap-8">
      {communitiySections.map((section) => (
        <section key={section.filter}>
          <div className="mb-8">
            <div className="flex items-start gap-2 text-2xl">
              <h1
                className={`mb-2 bg-gradient-to-r ${section.gradient} bg-clip-text font-bold text-transparent underline ${section.underlineColor} decoration-wavy decoration-2 underline-offset-4`}
              >
                {section.title}
              </h1>
              <h1 className="font-medium text-gray-600">Communities</h1>
            </div>
            <p className="text-gray-600">{section.description}</p>
          </div>
          <CommunityGrid filter={section.filter}></CommunityGrid>
        </section>
      ))}
    </div>
  );
};

export default CommunitiesList;

import Link from 'next/link';
import type { Category } from '@/lib/types';
import { Card } from './ui/card';

type CategoryCardProps = {
  category: Category;
};

export default function CategoryCard({ category }: CategoryCardProps) {
  const Icon = category.icon;

  return (
    <Link href={`/listings/${category.id}`} className="group block">
      <Card className="flex flex-col items-center justify-center text-center p-4 h-full transition-all duration-200 ease-in-out group-hover:shadow-lg group-hover:-translate-y-1">
        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-full mb-2">
            <Icon className="w-6 h-6" />
        </div>
        <h2 className="font-semibold text-sm text-gray-800">{category.name}</h2>
      </Card>
    </Link>
  );
}

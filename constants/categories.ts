import { ShoppingBag, Home, Briefcase, UserPlus, Wrench, Store } from 'lucide-react-native';

export const CATEGORIES = [
    {
        name: 'Buy/Sell Products',
        id: 'buy-sell',
        icon: ShoppingBag,
        color: 'text-rose-500',
        bg: 'bg-rose-50',
        hex: '#f43f5e',
        subcategories: [
            { label: 'Mobile & Accessories', value: 'mobile' },
            { label: 'Electronics & Appliances', value: 'electronics' },
            { label: 'Bikes & Vehicles', value: 'vehicles' },
            { label: 'Furniture & Decor', value: 'furniture' },
            { label: 'Fashion & Clothing', value: 'fashion' },
            { label: 'Books, Sports & Hobbies', value: 'hobbies' },
            { label: 'Pets', value: 'pets' },
            { label: 'Other', value: 'other' }
        ]
    },
    {
        name: 'Rentals',
        id: 'rentals',
        icon: Home,
        color: 'text-sky-500',
        bg: 'bg-sky-50',
        hex: '#0ea5e9',
        subcategories: [
            { label: 'Apartment/Flat', value: 'apartment' },
            { label: 'House/Villa', value: 'house' },
            { label: 'PG & Hostels', value: 'pg' },
            { label: 'Shop & Office', value: 'commercial' },
            { label: 'Land & Plot', value: 'land' },
            { label: 'Vehicle for Rent', value: 'vehicle-rent' },
            { label: 'Other', value: 'other' }
        ]
    },
    {
        name: 'Find Jobs',
        id: 'jobs',
        icon: Briefcase,
        color: 'text-violet-500',
        bg: 'bg-violet-50',
        hex: '#8b5cf6',
        subcategories: [
            { label: 'Driver', value: 'driver' },
            { label: 'Delivery Boy', value: 'delivery' },
            { label: 'Maid/Housekeeper', value: 'maid' },
            { label: 'Cook/Chef', value: 'cook' },
            { label: 'Security Guard', value: 'security' },
            { label: 'Sales & Marketing', value: 'sales' },
            { label: 'Office Help/Peon', value: 'office-help' },
            { label: 'Technician (AC/Elec)', value: 'technician' },
            { label: 'Other', value: 'other' }
        ]
    },
    {
        name: 'Hire Workers',
        id: 'hire',
        icon: UserPlus,
        color: 'text-indigo-500',
        bg: 'bg-indigo-50',
        hex: '#6366f1',
        subcategories: [
            { label: 'Labour / Helper', value: 'labour' },
            { label: 'Painter / Whitewash', value: 'painter' },
            { label: 'Carpenter / Furniture', value: 'carpenter' },
            { label: 'Plumber / Pipe Fitter', value: 'plumber' },
            { label: 'Electrician', value: 'electrician' },
            { label: 'Mason / Raj Mistry', value: 'mason' },
            { label: 'Tile & Marble Mistry', value: 'tile-mistry' },
            { label: 'Welder / Fabricator', value: 'welder' },
            { label: 'Mechanic (Bike/Car)', value: 'mechanic' },
            { label: 'AC / Fridge Repair', value: 'appliance-repair' },
            { label: 'Construction Worker', value: 'construction' },
            { label: 'House Maid / Cleaner', value: 'maid-helper' },
            { label: 'Driver', value: 'driver' },
            { label: 'Cook / Chef', value: 'cook' },
            { label: 'Security Guard', value: 'security' },
            { label: 'Other', value: 'other' }
        ]
    },
    {
        name: 'Provide Services',
        id: 'services',
        icon: Wrench,
        color: 'text-emerald-500',
        bg: 'bg-emerald-50',
        hex: '#10b981',
        subcategories: [
            { label: 'Home Cleaning', value: 'cleaning' },
            { label: 'AC & Appliance Repair', value: 'repair' },
            { label: 'Salon & Beauty', value: 'salon' },
            { label: 'Tiffin Service', value: 'tiffin' },
            { label: 'Movers & Packers', value: 'movers' },
            { label: 'Event Planner', value: 'event' },
            { label: 'Tutor/Coaching', value: 'tutor' },
            { label: 'Other', value: 'other' }
        ]
    },
    {
        name: 'Business Owner',
        id: 'business',
        icon: Store,
        color: 'text-amber-500',
        bg: 'bg-amber-50',
        hex: '#f59e0b',
        subcategories: [
            { label: 'Wholesaler', value: 'wholesaler' },
            { label: 'Manufacturer', value: 'manufacturer' },
            { label: 'Retail Shop', value: 'retail' },
            { label: 'Franchise', value: 'franchise' },
            { label: 'Distributor', value: 'distributor' },
            { label: 'Other', value: 'other' }
        ]
    },
];

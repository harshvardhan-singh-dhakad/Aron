'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import type { AnyListing } from '@/lib/types';
import { MapPin, Calendar, CheckCircle, Sparkles, Briefcase, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { categories as allCategories } from '@/lib/mockData';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { collection, serverTimestamp, addDoc, query, where, getDocs } from 'firebase/firestore';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';


type ListingCardProps = {
  listing: AnyListing;
};

const renderPrice = (listing: AnyListing) => {
    if ('price' in listing && listing.price && 'priceUnit' in listing && listing.priceUnit) {
        return <p className="font-bold text-green-600">{`₹${listing.price}/${listing.priceUnit}`}</p>;
    }
    if ('salary' in listing && listing.salary) {
        return <p className="font-bold text-green-600">{listing.salary}</p>;
    }
    if ('price' in listing && listing.price) {
        return <p className="font-bold text-green-600">{`₹${listing.price}`}</p>;
    }
    return <div className="h-6" />; // Placeholder for consistent height
}

const getSubCategoryName = (listing: AnyListing) => {
  if (!listing.subCategory) return null;
  const category = allCategories.find(c => c.id === listing.category);
  const subCategory = category?.subCategories?.find(sc => sc.id === listing.subCategory);
  return subCategory?.name || null;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const { toast } = useToast();
  const image = getPlaceholderImage(listing.imageUrl || 'default');
  const [postedAt, setPostedAt] = useState('');
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (listing.createdAt) {
      if (listing.createdAt && typeof (listing.createdAt as any).toDate === 'function') {
        setPostedAt(formatDistanceToNow((listing.createdAt as any).toDate(), { addSuffix: true }));
      } else {
        setPostedAt(formatDistanceToNow(new Date(listing.createdAt as any), { addSuffix: true }));
      }
    }
  }, [listing.createdAt]);
  
  const subCategoryName = getSubCategoryName(listing);
  
  const handleApplyOrBook = async () => {
    if (!user) {
        toast({
            title: "Login Required",
            description: "Please log in or sign up to apply for this listing.",
        });
        router.push('/profile');
        return;
    }
    if (user.uid === listing.ownerId) {
        toast({ variant: 'destructive', title: 'You cannot apply to your own listing.' });
        return;
    }
     if (!firestore) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not connect to the database.' });
        return;
    }
    
    // Check if user has already applied
    const applicationsRef = collection(firestore, 'applications');
    const q = query(applicationsRef, where('listingId', '==', listing.id), where('applicantId', '==', user.uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        toast({
            title: 'Already Applied',
            description: `You have already applied for "${listing.title}". You can contact the owner directly.`,
            duration: 9000,
            action: (
            <div className="flex gap-2 pt-2">
                <Button size="sm" asChild className="bg-green-600 hover:bg-green-700">
                    <a href={`tel:${listing.contactNumber}`}>Call Owner</a>
                </Button>
                 <Button size="sm" asChild variant="outline">
                    <a href={`https://wa.me/${listing.contactNumber}?text=Hello, I saw your ad for "${listing.title}" on Kaam Kiraya.`} target="_blank" rel="noopener noreferrer">
                        WhatsApp
                    </a>
                </Button>
            </div>
            ),
        });
        return;
    }


    const applicationData = {
        listingId: listing.id,
        listingTitle: listing.title,
        applicantId: user.uid,
        applicantName: user.isAnonymous ? 'Anonymous User' : (user.displayName || user.email || 'Registered User'),
        ownerId: listing.ownerId,
        status: 'pending',
        createdAt: serverTimestamp(),
    };

    try {
        await addDoc(collection(firestore, 'applications'), applicationData);
        toast({
          title: 'Application Sent!',
          description: `Your application for "${listing.title}" has been sent. You can now contact the owner.`,
          duration: 9000,
          action: (
            <div className="flex gap-2 pt-2">
                <Button size="sm" asChild className="bg-green-600 hover:bg-green-700">
                    <a href={`tel:${listing.contactNumber}`}>Call Owner</a>
                </Button>
                 <Button size="sm" asChild variant="outline">
                    <a href={`https://wa.me/${listing.contactNumber}?text=Hello, I saw your ad for "${listing.title}" on Kaam Kiraya.`} target="_blank" rel="noopener noreferrer">
                        WhatsApp
                    </a>
                </Button>
            </div>
          ),
        });
    } catch(e) {
        console.error("Error creating application: ", e);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not send application. Please try again.',
        });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: listing.title,
      text: `Check out this listing on Kaam Kiraya: ${listing.title}`,
      url: `${window.location.origin}/listing/${listing.id}`,
    };
    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            // Fallback for browsers that don't support navigator.share
            await navigator.clipboard.writeText(shareData.url);
            toast({ title: 'Link Copied!', description: 'Listing link has been copied to your clipboard.' });
        }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        variant: 'destructive',
        title: 'Could not share',
        description: 'There was an error trying to share this listing.',
      });
    }
  };


  const isJob = listing.category === 'jobs';
  const buttonText = isJob ? 'Apply Now' : 'Book Now';
  const ButtonIcon = isJob ? Briefcase : Sparkles;
  
  const isOwner = user ? user.uid === listing.ownerId : false;
  const isButtonDisabled = isOwner;

  const getDisabledTooltip = () => {
    if (isOwner) return "You cannot apply to your own listing.";
    return "";
  }

  const ActionButton = (
      <Button
        onClick={handleApplyOrBook}
        className={cn("flex-1 text-white",
            isJob ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
        )}
        disabled={isButtonDisabled}
    >
        <ButtonIcon size={18} />
        {buttonText}
    </Button>
  );

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      <Link href={`/listing/${listing.id}`} className="block">
        <div className="relative w-full h-48">
            {image && <Image
                src={image.imageUrl}
                alt={listing.title}
                fill
                className="object-cover"
                data-ai-hint={image.imageHint}
                sizes="(max-width: 768px) 100vw, 50vw"
            />}
            {subCategoryName && (
              <div className="absolute top-2 right-2 bg-primary text-white text-xs font-semibold px-2 py-1 rounded-md">
                {subCategoryName}
              </div>
            )}
        </div>
        <div className="p-4">
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-lg leading-snug text-gray-900 mb-1 line-clamp-2 pr-2">{listing.title}</h3>
              {listing.isVerifiedPost && (
                <div className="flex-shrink-0 flex items-center gap-1 text-green-600">
                  <CheckCircle size={18} />
                  <span className="text-xs font-bold">Verified</span>
                </div>
              )}
            </div>
            
            {listing.description && <p className="text-sm text-gray-600 mb-2 line-clamp-2">{listing.description}</p>}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{listing.location}</span>
            </div>
             <div className="text-sm text-gray-700 mb-3">
               {renderPrice(listing)}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    <span>{postedAt}</span>
                </div>
            </div>
        </div>
      </Link>
      <div className="p-4 border-t border-gray-100 flex gap-3">
        <Button
            onClick={handleShare}
            variant="outline"
            className="flex-1"
        >
            <Share2 size={18} />
            Share
        </Button>
        
        {isButtonDisabled ? (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>{ActionButton}</TooltipTrigger>
                    <TooltipContent>
                        <p>{getDisabledTooltip()}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ) : (
            ActionButton
        )}
      </div>
    </div>
  );
}

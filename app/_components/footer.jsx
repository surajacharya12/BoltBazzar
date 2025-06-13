'use client';

import React, { useEffect, useState } from 'react';
import { Clock, Mail, MapPin, Phone, Facebook, Github, Linkedin, Instagram } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { client } from '@/sanity/lib/client';
import { useRouter } from 'next/navigation';

// Utility function
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Dummy tooltip system
const Tooltip = ({ children }) => <div className="relative inline-block">{children}</div>;
const TooltipTrigger = ({ children }) => children;
const TooltipContent = ({ children, className }) => (
  <div
    className={cn(
      "absolute bottom-full mb-2 px-2 py-1 rounded bg-gray-700 text-white text-xs whitespace-nowrap dark:bg-gray-300 dark:text-gray-900",
      className
    )}
  >
    {children}
  </div>
);

// Text Components
const SubTitle = ({ children }) => (
  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{children}</h3>
);
const SubText = ({ children }) => (
  <p className="text-gray-600 dark:text-gray-300 text-sm">{children}</p>
);

// Logo
const Logo = ({ className }) => (
  <span className={cn("font-bold text-shop_dark_green dark:text-shop_light_green", className)}>
    BoltBazaar
  </span>
);

// Footer Data
const quickLinksData = [
  { title: 'Home', href: '/' },
  { title: 'Shop', href: '/shop' },
  { title: 'Blog', href: '/blog' },
  { title: 'Contact', href: '/contact' },
  { title: 'Hot Deal', href: '/hot-deal' },
];

const contactData = [
  {
    title: 'Visit Us',
    subtitle: 'Kathmandu, Nepal',
    href: 'https://maps.google.com?q=Kathmandu,Nepal',
    icon: <MapPin className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors" />,
  },
  {
    title: 'Call Us',
    subtitle: '+977 9801475272',
    icon: <Phone className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors" />,
  },
  {
    title: 'Working Hours',
    subtitle: 'Mon - Sat: 10:00 AM - 7:00 PM',
    icon: <Clock className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors" />,
  },
  {
    title: 'Email Us',
    subtitle: 'boltbazaar@gmail.com',
    icon: <Mail className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors" />,
  },
];

const socialLinks = [
  {
    title: 'Github',
    href: 'https://github.com/surajacharya12',
    icon: <Github className="w-5 h-5" />,
  },
  {
    title: 'Linkedin',
    href: 'https://www.linkedin.com/in/suraj-acharya-97a3622a4/',
    icon: <Linkedin className="w-5 h-5" />,
  },
  {
    title: 'Facebook',
    href: 'https://www.facebook.com/auraj.acharya',
    icon: <Facebook className="w-5 h-5" />,
  },
  {
    title: 'Instagram',
    href: 'https://www.instagram.com/suraj_acharyaa10/',
    icon: <Instagram className="w-5 h-5" />, // Replace with Instagram icon if available
  },
];

const Footer = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    // Fetch categories with product count
    client.fetch(`*[_type == 'category']{title, "productCount": count(*[_type=='product' && references(^._id)])} | order(productCount desc)[0...7]`)
      .then((data) => setCategories(data.map(c => c.title)));
  }, []);

  return (
    <footer className="space-y-12 bg-white dark:bg-gray-900 px-6 py-12 text-gray-700 dark:text-gray-300">

      {/* Top Contact Section with Heading + Line */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-300 dark:border-gray-600 pb-2">
          Get In Touch
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {contactData.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 group hover:bg-gray-50 dark:hover:bg-gray-800 p-4 transition-colors rounded cursor-pointer"
            >
              {item.icon}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-black dark:group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Content */}
      <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand + Social */}
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center space-x-1">
            <h2 className="text-2xl text-shop_dark_green dark:text-shop_light_green font-black tracking-wider uppercase hover:text-shop_light_green dark:hover:text-shop_dark_green transition-colors font-sans">
              BoltBazaar
            </h2>
          </Link>
          <SubText>
            Discover curated furniture collections at BoltBazaar, blending style and comfort to elevate your living spaces.
          </SubText>
          <div className="flex items-center gap-3.5">
            {socialLinks.map((item) => (
              <Tooltip key={item.title}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-full hover:text-white hover:border-shop_light_green dark:hover:border-shop_light_green bg-white dark:bg-gray-800 hover:bg-shop_light_green dark:hover:bg-shop_light_green transition-colors cursor-pointer"
                  >
                    {item.icon}
                  </Link>
                </TooltipTrigger>
                <TooltipContent>{item.title}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <SubTitle>Quick Links</SubTitle>
          <ul className="space-y-3 mt-4">
            {quickLinksData.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className="hover:text-shop_light_green dark:hover:text-shop_light_green transition-colors font-medium"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <SubTitle>Categories</SubTitle>
          <ul className="space-y-3 mt-4">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <li key={cat}>
                  <Link
                    href={{ pathname: '/shop', query: { category: cat } }}
                    className="hover:text-shop_light_green dark:hover:text-shop_light_green transition-colors font-medium cursor-pointer"
                  >
                    {cat}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-gray-400">No categories found.</li>
            )}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <SubTitle>Newsletter</SubTitle>
          <SubText>Subscribe to receive updates and exclusive offers.</SubText>
          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            <Input
              placeholder="Enter your email"
              type="email"
              required
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <Button className="w-full">Subscribe</Button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="py-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
        <div>
          © {new Date().getFullYear()} <Logo className="inline-block text-sm" />. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

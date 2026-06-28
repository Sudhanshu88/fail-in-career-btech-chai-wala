import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-chai-dark text-gray-300 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-2xl font-bold text-chai-orange mb-4">Fail In Career<br/>B.Tech Chai Wala</h3>
                        <p className="text-sm">Serving the best chai in town. From our passion for tea to your cup, experience the authentic taste of Indian street chai in a modern setting.</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><a href="/" className="hover:text-chai-orange transition-colors">Home</a></li>
                            <li><a href="/menu" className="hover:text-chai-orange transition-colors">Menu</a></li>
                            <li><a href="/contact" className="hover:text-chai-orange transition-colors">Contact Us</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-chai-orange text-2xl transition-colors"><FaFacebook /></a>
                            <a href="#" className="hover:text-chai-orange text-2xl transition-colors"><FaTwitter /></a>
                            <a href="#" className="hover:text-chai-orange text-2xl transition-colors"><FaInstagram /></a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} B.Tech Chai Wala. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

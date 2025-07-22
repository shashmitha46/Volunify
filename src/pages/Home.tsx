import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, MapPin, Calendar, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Connect. Volunteer. Impact.
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Join thousands of volunteers making a difference in communities worldwide. 
              Find opportunities, connect with like-minded people, and create positive change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center space-x-2"
              >
                <span>Start Volunteering</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/services"
                className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 flex items-center space-x-2"
              >
                <span>Explore Opportunities</span>
                <MapPin className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-400 opacity-20 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-20 w-16 h-16 bg-blue-400 opacity-15 rounded-full animate-pulse"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose VolunteerConnect?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform makes it easy to find meaningful volunteer opportunities 
              and connect with passionate communities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Find Local Opportunities</h3>
              <p className="text-gray-600 leading-relaxed">
                Discover volunteer opportunities in your neighborhood. Our location-based search 
                helps you find causes close to your heart and home.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Connect with Volunteers</h3>
              <p className="text-gray-600 leading-relaxed">
                Build meaningful relationships with fellow volunteers. Share experiences, 
                collaborate on projects, and grow your impact together.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Flexible Scheduling</h3>
              <p className="text-gray-600 leading-relaxed">
                Choose opportunities that fit your schedule. From one-time events to 
                ongoing commitments, find the perfect way to make a difference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="transform hover:scale-105 transition-transform duration-200">
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Active Volunteers</div>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-200">
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-blue-100">Opportunities</div>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-200">
              <div className="text-4xl font-bold mb-2">1,500+</div>
              <div className="text-blue-100">Organizations</div>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-200">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Cities</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Join our community of passionate volunteers and start creating positive 
            change in your community today.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 space-x-2"
          >
            <span>Join VolunteerConnect</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
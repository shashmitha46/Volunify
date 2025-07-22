import React, { useState, useEffect } from 'react';
import { Search, MapPin, Users, Clock, Filter } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  location: { lat: number; lng: number; address: string };
  category: string;
  volunteersNeeded: number;
  date: string;
  time: string;
  organizer: string;
  requirements: string[];
  image: string;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  const categories = [
    'all',
    'Community Support',
    'Environmental',
    'Elder Care',
    'Education',
    'Healthcare',
    'Animal Welfare'
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm, selectedCategory]);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = services;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.location.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  };

  const volunteerForService = async (serviceId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to volunteer for services');
      return;
    }

    try {
      await fetch(`http://localhost:3001/api/volunteer-for-service/${serviceId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchServices(); // Refresh services
      alert('Successfully volunteered! Check your dashboard for details.');
    } catch (error) {
      console.error('Error volunteering for service:', error);
      alert('Error signing up for service. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Volunteer Opportunities
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover meaningful ways to make a difference in your community. 
            Find opportunities that match your skills and interests.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-48"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found {filteredServices.length} opportunities
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative">
                <img 
                  src={service.image} 
                  alt={service.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                    {service.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex items-center bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Users className="h-4 w-4 mr-1 text-gray-600" />
                  <span className="text-sm font-medium text-gray-800">{service.volunteersNeeded}</span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    {service.location.address}
                  </div>
                  
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    {new Date(service.date).toLocaleDateString()} at {service.time}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">Organized by:</div>
                  <div className="font-semibold text-gray-800">{service.organizer}</div>
                </div>

                {service.requirements.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Requirements:</div>
                    <div className="flex flex-wrap gap-1">
                      {service.requirements.slice(0, 2).map((req, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {req}
                        </span>
                      ))}
                      {service.requirements.length > 2 && (
                        <span className="text-gray-500 text-xs">+{service.requirements.length - 2} more</span>
                      )}
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={() => volunteerForService(service.id)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Volunteer Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No opportunities found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or category filter to find more opportunities.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
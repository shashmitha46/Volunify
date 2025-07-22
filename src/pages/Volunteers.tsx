import React, { useState, useEffect } from 'react';
import { Users, MapPin, Mail, MessageCircle, Star } from 'lucide-react';

interface Volunteer {
  id: string;
  name: string;
  email: string;
  skills: string[];
  interests: string[];
  location: string;
  phone: string;
  joinedDate: string;
  profileImage: string;
}

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/volunteers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setVolunteers(data);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedVolunteer) return;

    const token = localStorage.getItem('token');
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: selectedVolunteer.id,
          content: message
        })
      });
      setMessage('');
      setSelectedVolunteer(null);
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
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
            Connect with Volunteers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet fellow volunteers in your community. Build connections, share experiences, 
            and collaborate on meaningful projects.
          </p>
        </div>

        {/* Volunteers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {volunteers.map((volunteer) => (
            <div key={volunteer.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative">
                <img 
                  src={volunteer.profileImage} 
                  alt={volunteer.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium text-gray-800">4.9</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{volunteer.name}</h3>
                
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  {volunteer.location || 'Location not specified'}
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">Skills:</div>
                  <div className="flex flex-wrap gap-1">
                    {volunteer.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                    {volunteer.skills.length > 3 && (
                      <span className="text-gray-500 text-xs">+{volunteer.skills.length - 3} more</span>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">Interests:</div>
                  <div className="flex flex-wrap gap-1">
                    {volunteer.interests.slice(0, 3).map((interest, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        {interest}
                      </span>
                    ))}
                    {volunteer.interests.length > 3 && (
                      <span className="text-gray-500 text-xs">+{volunteer.interests.length - 3} more</span>
                    )}
                  </div>
                </div>

                <div className="mb-4 text-sm text-gray-500">
                  Member since {new Date(volunteer.joinedDate).toLocaleDateString()}
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setSelectedVolunteer(volunteer)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Message</span>
                  </button>
                  <a 
                    href={`mailto:${volunteer.email}`}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Modal */}
        {selectedVolunteer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Send message to {selectedVolunteer.name}
              </h3>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
              />
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={sendMessage}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Send Message
                </button>
                <button
                  onClick={() => setSelectedVolunteer(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* No Volunteers */}
        {volunteers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No volunteers found</h3>
            <p className="text-gray-500">
              Be the first to join and start connecting with fellow volunteers!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
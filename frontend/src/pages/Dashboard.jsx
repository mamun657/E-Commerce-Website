import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Package, Heart } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import { motion } from 'framer-motion';
import { formatBDT } from '../utils/currency';
import { getPrimaryImage, FALLBACK_PRODUCT_IMAGE } from '../utils/image';
import { useUser } from '../context/UserContext';
import Settings from '../components/settings/Settings';

const Dashboard = () => {
  const { user, setUser } = useUser();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    avatar: user?.avatar || '',
  });
  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'orders', label: 'Orders' },
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'settings', label: 'Settings' },
  ];

  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'wishlist') {
      fetchWishlist();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/users/orders');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/users/wishlist');
      setWishlist(response.data.wishlist);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    }
  };

  useEffect(() => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      avatar: user?.avatar || '',
    });
    setAvatarPreview(user?.avatar || '');
  }, [user]);

  useEffect(() => {
    // no cleanup needed for base64 strings
  }, []);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setAvatarPreview(base64String);
      setProfileData((prev) => ({ ...prev, avatar: base64String }));
    };
    reader.readAsDataURL(file);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const updatedUser = { ...profileData, avatar: avatarPreview };
    try {
      await api.put('/users/profile', updatedUser);
      setUser(updatedUser);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile', error);
      setUser(updatedUser);
      alert('Profile updated locally. Backend update failed.');
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={
                `rounded-lg px-4 py-2 text-sm font-semibold transition border ` +
                (isActive
                  ? 'bg-primary/10 text-primary border-primary'
                  : 'text-muted-foreground border-border hover:text-foreground hover:border-primary/50')
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-muted text-xl font-semibold">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt={profileData.name || 'Profile avatar'} className="h-full w-full object-cover" />
                  ) : (
                    <span>{profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}</span>
                  )}
                </div>
                <div className="w-full sm:w-auto">
                  <label className="block mb-2 font-medium">Profile Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">PNG or JPG, max 2MB.</p>
                </div>
              </div>
              <div>
                <label className="block mb-2 font-medium">Name</label>
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Email</label>
                <Input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Phone</label>
                <Input
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Street Address</label>
                <Input
                  value={profileData.address.street}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      address: { ...profileData.address, street: e.target.value },
                    })
                  }
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">City</label>
                  <Input
                    value={profileData.address.city}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: { ...profileData.address, city: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">State</label>
                  <Input
                    value={profileData.address.state}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: { ...profileData.address, state: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">ZIP Code</label>
                  <Input
                    value={profileData.address.zipCode}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: { ...profileData.address, zipCode: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Country</label>
                  <Input
                    value={profileData.address.country}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: { ...profileData.address, country: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <Button type="submit" variant="gradient" disabled={loading}>
                {loading ? 'Saving...' : 'Update Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No orders yet</p>
                <Link to="/shop" className="mt-4 inline-block">
                  <Button variant="gradient">Start Shopping</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order._id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-semibold">Order #{order._id.slice(-8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    {order.orderItems.map((item) => (
                      <div key={item._id} className="flex justify-between text-sm">
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span>{formatBDT(item.price * item.quantity).formatted}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-semibold">Total: {formatBDT(order.totalPrice).formatted}</span>
                    <Link to={`/dashboard/orders/${order._id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'wishlist' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="p-12 text-center">
                <Heart size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Your wishlist is empty</p>
                <Link to="/shop" className="mt-4 inline-block">
                  <Button variant="gradient">Start Shopping</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            wishlist.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <Link to={`/product/${product._id}`}>
                    <div className="aspect-square overflow-hidden bg-muted">
                      <img
                        src={getPrimaryImage(product?.images, FALLBACK_PRODUCT_IMAGE)}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <Link to={`/product/${product._id}`}>
                      <h3 className="font-semibold hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-2xl font-bold mt-2">{formatBDT(Number(product.price) || 0).formatted}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <Settings />
      )}
    </div>
  );
};

export default Dashboard;

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Users, Package, ShoppingCart, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatBDT } from '../../utils/currency';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'text-green-600',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'text-purple-600',
    },
    {
      title: 'Total Revenue',
      value: formatBDT(Number(stats?.totalRevenue) || 0).formatted,
      icon: DollarSign,
      color: 'text-yellow-600',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Link to="/admin/products">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
              Manage Products
            </button>
          </Link>
          <Link to="/admin/orders">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
              Manage Orders
            </button>
          </Link>
          <Link to="/admin/users">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
              Manage Users
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={`${stat.color} w-8 h-8`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentOrders?.length === 0 ? (
              <p className="text-muted-foreground">No recent orders</p>
            ) : (
              <div className="space-y-4">
                {stats?.recentOrders?.slice(0, 5).map((order) => (
                  <div key={order._id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">Order #{order._id.slice(-8)}</p>
                      <p className="text-sm text-muted-foreground">{order.user?.name}</p>
                    </div>
                    <p className="font-semibold">{formatBDT(order.totalPrice).formatted}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.topProducts?.length === 0 ? (
              <p className="text-muted-foreground">No products</p>
            ) : (
              <div className="space-y-4">
                {stats?.topProducts?.map((product) => (
                  <div key={product._id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Rating: {product.rating?.average?.toFixed(1) || '0.0'}
                      </p>
                    </div>
                    <p className="font-semibold">{formatBDT(Number(product.price) || 0).formatted}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

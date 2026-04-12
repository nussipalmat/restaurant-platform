import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, Boxes, ClipboardList, Table2, MessageCircle, Send, Plus, Pencil, Trash2, AlertTriangle, CalendarClock, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

import { restaurantsAPI } from '../api/restaurants';
import { inventoryAPI } from '../api/inventory';
import { ordersAPI } from '../api/orders';
import { reservationsAPI } from '../api/reservations';
import { supportAPI } from '../api/support';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { formatCurrency, formatDateTime } from '../utils/formatters';

const TELEGRAM_SUPPORT_URL = 'https://t.me/username77772';

const SectionCard = ({ title, icon: Icon, subtitle, children, actions }) => (
  <section className="bg-white border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
    <div className="flex items-start justify-between gap-4 border-b-4 border-black p-6 bg-gray-50">
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-400 border-2 border-black">
            <Icon className="h-5 w-5" strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">{title}</h2>
        </div>
        {subtitle ? <p className="mt-3 text-sm font-bold uppercase text-gray-600">{subtitle}</p> : null}
      </div>
      {actions}
    </div>
    <div className="p-6">{children}</div>
  </section>
);

const StatusPill = ({ children, tone = 'default' }) => {
  const toneClasses = {
    success: 'bg-green-400',
    danger: 'bg-red-500 text-white',
    warning: 'bg-yellow-400',
    info: 'bg-blue-400 text-white',
    default: 'bg-white',
  };

  return (
    <span className={`inline-flex items-center border-2 border-black px-3 py-1 text-xs font-black uppercase ${toneClasses[tone] || toneClasses.default}`}>
      {children}
    </span>
  );
};

const EmptyBlock = ({ text }) => (
  <div className="border-4 border-dashed border-gray-300 p-10 text-center text-sm font-black uppercase text-gray-400">
    {text}
  </div>
);

const OwnerDashboardPage = () => {
  const { user } = useAuth();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [inventoryDraft, setInventoryDraft] = useState({ name: '', category: '', current_quantity: '', minimum_quantity: '', unit: 'PIECE', unit_cost: '', supplier_name: '', supplier_contact: '' });
  const [tableDraft, setTableDraft] = useState({ table_number: '', capacity: '', location: '', is_available: true });
  const [restaurantDraft, setRestaurantDraft] = useState({});
  const [tableCheckDate, setTableCheckDate] = useState(new Date().toISOString().split('T')[0]);
  const [tableCheckTime, setTableCheckTime] = useState('19:00');
  const [supportForm, setSupportForm] = useState({ category: 'TECHNICAL', subject: '', description: '' });
  const [supportComment, setSupportComment] = useState('');

  const { data: restaurantsData, isLoading: loadingRestaurants, refetch: refetchRestaurants } = useQuery({
    queryKey: ['owner-restaurants'],
    queryFn: () => restaurantsAPI.getAll(),
  });

  const restaurants = restaurantsData?.results || restaurantsData || [];

  useEffect(() => {
    if (!selectedRestaurantId && restaurants.length > 0) {
      setSelectedRestaurantId(String(restaurants[0].id));
      setRestaurantDraft(restaurants[0]);
    }
  }, [restaurants, selectedRestaurantId]);

  const selectedRestaurant = useMemo(
    () => restaurants.find((restaurant) => String(restaurant.id) === String(selectedRestaurantId)),
    [restaurants, selectedRestaurantId]
  );

  useEffect(() => {
    if (selectedRestaurant) {
      setRestaurantDraft(selectedRestaurant);
    }
  }, [selectedRestaurant]);

  const { data: inventoryData, isLoading: loadingInventory, refetch: refetchInventory } = useQuery({
    queryKey: ['owner-inventory', selectedRestaurantId],
    queryFn: () => inventoryAPI.getItems({ restaurant: selectedRestaurantId }),
    enabled: Boolean(selectedRestaurantId),
  });

  const { data: tablesData, isLoading: loadingTables, refetch: refetchTables } = useQuery({
    queryKey: ['owner-tables', selectedRestaurantId],
    queryFn: () => restaurantsAPI.getTables({ restaurant: selectedRestaurantId }),
    enabled: Boolean(selectedRestaurantId),
  });

  const { data: ordersData, isLoading: loadingOrders, refetch: refetchOrders } = useQuery({
    queryKey: ['owner-orders', selectedRestaurantId],
    queryFn: () => ordersAPI.getAll({ restaurant: selectedRestaurantId, ordering: '-created_at' }),
    enabled: Boolean(selectedRestaurantId),
  });

  const { data: reservationsData, isLoading: loadingReservations, refetch: refetchReservations } = useQuery({
    queryKey: ['owner-reservations', selectedRestaurantId],
    queryFn: () => reservationsAPI.getAll({ restaurant: selectedRestaurantId, ordering: '-reservation_date,-reservation_time' }),
    enabled: Boolean(selectedRestaurantId),
  });

  const { data: supportData, isLoading: loadingSupport, refetch: refetchSupport } = useQuery({
    queryKey: ['owner-support'],
    queryFn: () => supportAPI.getAll({ ordering: '-created_at' }),
  });

  const inventoryItems = inventoryData?.results || inventoryData || [];
  const tableItems = tablesData?.results || tablesData || [];
  const orders = ordersData?.results || ordersData || [];
  const reservations = reservationsData?.results || reservationsData || [];
  const tickets = supportData?.results || supportData || [];

  const busyTableIds = useMemo(() => {
    return new Set(
      reservations
        .filter((reservation) =>
          String(reservation.table) &&
          reservation.reservation_date === tableCheckDate &&
          String(reservation.reservation_time).slice(0, 5) === tableCheckTime.slice(0, 5) &&
          ['PENDING', 'CONFIRMED', 'SEATED'].includes(reservation.status)
        )
        .map((reservation) => Number(reservation.table))
    );
  }, [reservations, tableCheckDate, tableCheckTime]);

  const handleRestaurantSave = async () => {
    if (!selectedRestaurant?.slug) return;
    try {
      await restaurantsAPI.update(selectedRestaurant.slug, {
        name: restaurantDraft.name,
        description: restaurantDraft.description,
        phone: restaurantDraft.phone,
        email: restaurantDraft.email,
        website: restaurantDraft.website,
        is_accepting_orders: restaurantDraft.is_accepting_orders,
        status: restaurantDraft.status,
      });
      toast.success('Restaurant updated');
      refetchRestaurants();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update restaurant');
    }
  };

  const handleCreateInventoryItem = async () => {
    if (!selectedRestaurantId) return;
    try {
      await inventoryAPI.createItem({
        ...inventoryDraft,
        restaurant: Number(selectedRestaurantId),
        current_quantity: Number(inventoryDraft.current_quantity),
        minimum_quantity: Number(inventoryDraft.minimum_quantity),
        unit_cost: Number(inventoryDraft.unit_cost),
      });
      toast.success('Inventory item created');
      setInventoryDraft({ name: '', category: '', current_quantity: '', minimum_quantity: '', unit: 'PIECE', unit_cost: '', supplier_name: '', supplier_contact: '' });
      refetchInventory();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create inventory item');
    }
  };

  const handleQuickStockUpdate = async (item, delta) => {
    const nextValue = Math.max(0, Number(item.current_quantity) + delta);
    try {
      await inventoryAPI.updateItem(item.id, { current_quantity: nextValue });
      toast.success('Stock updated');
      refetchInventory();
    } catch {
      toast.error('Failed to update stock');
    }
  };

  const handleDeleteInventoryItem = async (itemId) => {
    if (!window.confirm('Delete this inventory item?')) return;
    try {
      await inventoryAPI.deleteItem(itemId);
      toast.success('Inventory item deleted');
      refetchInventory();
    } catch {
      toast.error('Failed to delete inventory item');
    }
  };

  const handleCreateTable = async () => {
    if (!selectedRestaurantId) return;
    try {
      await restaurantsAPI.createTable({
        ...tableDraft,
        restaurant: Number(selectedRestaurantId),
        capacity: Number(tableDraft.capacity),
      });
      toast.success('Table created');
      setTableDraft({ table_number: '', capacity: '', location: '', is_available: true });
      refetchTables();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create table');
    }
  };

  const handleToggleTableAvailability = async (table) => {
    try {
      await restaurantsAPI.updateTable(table.id, { is_available: !table.is_available });
      toast.success('Table availability updated');
      refetchTables();
    } catch {
      toast.error('Failed to update table');
    }
  };

  const handleDeleteTable = async (tableId) => {
    if (!window.confirm('Delete this table?')) return;
    try {
      await restaurantsAPI.deleteTable(tableId);
      toast.success('Table removed');
      refetchTables();
    } catch {
      toast.error('Failed to delete table');
    }
  };

  const handleOrderStatus = async (order, status) => {
    try {
      await ordersAPI.update(order.id, { status });
      toast.success('Order status updated');
      refetchOrders();
    } catch {
      toast.error('Failed to update order');
    }
  };

  const handleReservationStatus = async (reservation, status) => {
    try {
      await reservationsAPI.update(reservation.id, { status });
      toast.success('Reservation updated');
      refetchReservations();
      refetchTables();
    } catch {
      toast.error('Failed to update reservation');
    }
  };

  const handleCreateSupportTicket = async () => {
    try {
      await supportAPI.create(supportForm);
      toast.success('Support ticket sent');
      setSupportForm({ category: 'TECHNICAL', subject: '', description: '' });
      refetchSupport();
    } catch {
      toast.error('Failed to create support ticket');
    }
  };

  const handleCommentSubmit = async (ticketId) => {
    if (!supportComment.trim()) return;
    try {
      await supportAPI.addComment(ticketId, { comment: supportComment });
      toast.success('Message sent');
      setSupportComment('');
      refetchSupport();
    } catch {
      toast.error('Failed to send message');
    }
  };

  if (loadingRestaurants) {
    return <Loading fullScreen />;
  }

  if (user?.role !== 'RESTAURANT_OWNER') {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-4xl mx-auto bg-white border-4 border-black p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Owner access only</h1>
          <p className="mt-4 font-bold uppercase text-gray-600">This dashboard is available only for restaurant owners.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 space-y-10">
      <div className="border-b-8 border-black pb-8">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
          <div>
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">Owner Control Room</h1>
            <p className="mt-4 text-lg font-bold uppercase text-gray-600">Restaurants, stock, orders, tables, and support in one brutalist panel.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={TELEGRAM_SUPPORT_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-3 px-6 h-14 bg-blue-400 border-4 border-black text-sm font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              <Send className="h-4 w-4" strokeWidth={3} />
              Telegram support
            </a>
            <div className="bg-white border-4 border-black px-5 py-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Working restaurant</div>
              <select
                value={selectedRestaurantId}
                onChange={(event) => setSelectedRestaurantId(event.target.value)}
                className="mt-2 bg-transparent text-lg font-black uppercase outline-none"
              >
                {restaurants.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <SectionCard
        title="Restaurant profile"
        icon={Building2}
        subtitle="Core restaurant settings that owners can update from the frontend."
        actions={<Button onClick={handleRestaurantSave}>Save changes</Button>}
      >
        {!selectedRestaurant ? (
          <EmptyBlock text="No restaurants found for this owner." />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Input label="Name" value={restaurantDraft.name || ''} onChange={(e) => setRestaurantDraft((current) => ({ ...current, name: e.target.value }))} />
            <Input label="Website" value={restaurantDraft.website || ''} onChange={(e) => setRestaurantDraft((current) => ({ ...current, website: e.target.value }))} />
            <Input label="Phone" value={restaurantDraft.phone || ''} onChange={(e) => setRestaurantDraft((current) => ({ ...current, phone: e.target.value }))} />
            <Input label="Email" value={restaurantDraft.email || ''} onChange={(e) => setRestaurantDraft((current) => ({ ...current, email: e.target.value }))} />
            <div className="lg:col-span-2">
              <label className="block text-xs font-black uppercase tracking-widest text-black mb-2">Description</label>
              <textarea
                value={restaurantDraft.description || ''}
                onChange={(e) => setRestaurantDraft((current) => ({ ...current, description: e.target.value }))}
                rows={5}
                className="w-full border-4 border-black px-4 py-3 font-bold outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                id="is_accepting_orders"
                type="checkbox"
                checked={Boolean(restaurantDraft.is_accepting_orders)}
                onChange={(e) => setRestaurantDraft((current) => ({ ...current, is_accepting_orders: e.target.checked }))}
                className="h-5 w-5 border-2 border-black"
              />
              <label htmlFor="is_accepting_orders" className="font-black uppercase">Accepting orders</label>
            </div>
            <div className="flex items-center gap-3">
              <label className="font-black uppercase">Status</label>
              <select
                value={restaurantDraft.status || 'ACTIVE'}
                onChange={(e) => setRestaurantDraft((current) => ({ ...current, status: e.target.value }))}
                className="border-4 border-black px-3 py-2 font-black uppercase"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="PENDING">PENDING</option>
                <option value="SUSPENDED">SUSPENDED</option>
              </select>
            </div>
          </div>
        )}
      </SectionCard>

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-10">
        <SectionCard
          title="Inventory"
          icon={Boxes}
          subtitle="Create items, check low stock, and perform quick quantity changes."
          actions={
            <div className="flex items-center gap-3">
              <StatusPill tone="warning">{inventoryItems.filter((item) => item.is_low_stock).length} low stock</StatusPill>
              <Button onClick={handleCreateInventoryItem}><Plus className="h-4 w-4 mr-2" />Add item</Button>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Input label="Item name" value={inventoryDraft.name} onChange={(e) => setInventoryDraft((current) => ({ ...current, name: e.target.value }))} />
            <Input label="Category" value={inventoryDraft.category} onChange={(e) => setInventoryDraft((current) => ({ ...current, category: e.target.value }))} />
            <Input label="Current qty" type="number" value={inventoryDraft.current_quantity} onChange={(e) => setInventoryDraft((current) => ({ ...current, current_quantity: e.target.value }))} />
            <Input label="Min qty" type="number" value={inventoryDraft.minimum_quantity} onChange={(e) => setInventoryDraft((current) => ({ ...current, minimum_quantity: e.target.value }))} />
            <Input label="Unit cost" type="number" value={inventoryDraft.unit_cost} onChange={(e) => setInventoryDraft((current) => ({ ...current, unit_cost: e.target.value }))} />
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-black mb-2">Unit</label>
              <select value={inventoryDraft.unit} onChange={(e) => setInventoryDraft((current) => ({ ...current, unit: e.target.value }))} className="w-full border-4 border-black px-4 py-3 font-bold">
                {['KG', 'G', 'L', 'ML', 'PIECE', 'BOX', 'PACK'].map((unit) => <option key={unit} value={unit}>{unit}</option>)}
              </select>
            </div>
            <Input label="Supplier" value={inventoryDraft.supplier_name} onChange={(e) => setInventoryDraft((current) => ({ ...current, supplier_name: e.target.value }))} />
          </div>

          {loadingInventory ? (
            <Loading />
          ) : inventoryItems.length === 0 ? (
            <EmptyBlock text="No inventory items yet." />
          ) : (
            <div className="space-y-4">
              {inventoryItems.map((item) => (
                <div key={item.id} className="border-4 border-black p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-black uppercase tracking-tighter">{item.name}</h3>
                      {item.is_low_stock ? (
                        <StatusPill tone="danger"><AlertTriangle className="h-3 w-3 mr-1" />Low stock</StatusPill>
                      ) : (
                        <StatusPill tone="success">Healthy stock</StatusPill>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-bold uppercase text-gray-600">
                      {item.category} · {item.current_quantity} {item.unit} · min {item.minimum_quantity}
                    </p>
                    <p className="text-sm font-bold uppercase text-gray-600">Unit cost: {formatCurrency(item.unit_cost)}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Button variant="secondary" onClick={() => handleQuickStockUpdate(item, -1)}>-1</Button>
                    <Button variant="success" onClick={() => handleQuickStockUpdate(item, 1)}>+1</Button>
                    <Button variant="danger" onClick={() => handleDeleteInventoryItem(item.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Tables"
          icon={Table2}
          subtitle="Manage tables and see which ones are temporarily unavailable for the selected reservation slot."
          actions={<Button onClick={handleCreateTable}><Plus className="h-4 w-4 mr-2" />Add table</Button>}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Input label="Table no." value={tableDraft.table_number} onChange={(e) => setTableDraft((current) => ({ ...current, table_number: e.target.value }))} />
            <Input label="Capacity" type="number" value={tableDraft.capacity} onChange={(e) => setTableDraft((current) => ({ ...current, capacity: e.target.value }))} />
            <Input label="Location" value={tableDraft.location} onChange={(e) => setTableDraft((current) => ({ ...current, location: e.target.value }))} />
            <Input label="Check date" type="date" value={tableCheckDate} onChange={(e) => setTableCheckDate(e.target.value)} />
            <Input label="Check time" type="time" value={tableCheckTime} onChange={(e) => setTableCheckTime(e.target.value)} />
          </div>

          {loadingTables || loadingReservations ? (
            <Loading />
          ) : tableItems.length === 0 ? (
            <EmptyBlock text="No tables configured yet." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tableItems.map((table) => {
                const isBusy = busyTableIds.has(table.id);
                return (
                  <div key={table.id} className="border-4 border-black p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter">Table {table.table_number}</h3>
                        <p className="mt-1 text-sm font-bold uppercase text-gray-600">{table.capacity} guests · {table.location || 'Main hall'}</p>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <StatusPill tone={isBusy ? 'danger' : table.is_available ? 'success' : 'warning'}>
                          {isBusy ? 'Unavailable' : table.is_available ? 'Available' : 'Disabled'}
                        </StatusPill>
                        <StatusPill tone="default">{tableCheckDate} {tableCheckTime}</StatusPill>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-3 flex-wrap">
                      <Button variant={table.is_available ? 'outline' : 'success'} onClick={() => handleToggleTableAvailability(table)}>
                        {table.is_available ? 'Disable' : 'Enable'}
                      </Button>
                      <Button variant="danger" onClick={() => handleDeleteTable(table.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-10">
        <SectionCard title="Orders" icon={ClipboardList} subtitle="Recent restaurant orders with quick state management.">
          {loadingOrders ? (
            <Loading />
          ) : orders.length === 0 ? (
            <EmptyBlock text="No orders for this restaurant yet." />
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 12).map((order) => (
                <div key={order.id} className="border-4 border-black p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-2xl font-black uppercase tracking-tighter">{order.order_number || `Order #${order.id}`}</h3>
                        <StatusPill tone={['DELIVERED', 'READY'].includes(order.status) ? 'success' : order.status === 'CANCELLED' ? 'danger' : 'warning'}>
                          {order.status}
                        </StatusPill>
                        {order.reservation ? <StatusPill tone="info">Linked to reservation #{order.reservation}</StatusPill> : null}
                      </div>
                      <p className="mt-2 text-sm font-bold uppercase text-gray-600">{formatDateTime(order.created_at)} · {formatCurrency(order.total)} · {order.payment_method}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {['CONFIRMED', 'PREPARING', 'READY', 'DELIVERED'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => handleOrderStatus(order, status)}
                          className={`border-2 border-black px-3 py-2 text-xs font-black uppercase ${order.status === status ? 'bg-yellow-400' : 'bg-white hover:bg-gray-100'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Reservations" icon={CalendarClock} subtitle="Confirm, seat, or complete bookings. Tables become unavailable for active bookings at the chosen slot.">
          {loadingReservations ? (
            <Loading />
          ) : reservations.length === 0 ? (
            <EmptyBlock text="No reservations for this restaurant yet." />
          ) : (
            <div className="space-y-4">
              {reservations.slice(0, 12).map((reservation) => (
                <div key={reservation.id} className="border-4 border-black p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-2xl font-black uppercase tracking-tighter">Reservation #{reservation.id}</h3>
                        <StatusPill tone={['CONFIRMED', 'SEATED', 'COMPLETED'].includes(reservation.status) ? 'success' : reservation.status === 'CANCELLED' ? 'danger' : 'warning'}>
                          {reservation.status}
                        </StatusPill>
                      </div>
                      <p className="mt-2 text-sm font-bold uppercase text-gray-600">
                        Table {reservation.table} · {reservation.guests_count} guests · {reservation.reservation_date} {String(reservation.reservation_time).slice(0, 5)}
                      </p>
                      <p className="text-sm font-bold uppercase text-gray-600">{reservation.phone} · {reservation.email}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {['CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => handleReservationStatus(reservation, status)}
                          className={`border-2 border-black px-3 py-2 text-xs font-black uppercase ${reservation.status === status ? 'bg-yellow-400' : 'bg-white hover:bg-gray-100'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard
        title="Support chat"
        icon={MessageCircle}
        subtitle="Owners can contact support from the site chat or via Telegram."
        actions={
          <a
            href={TELEGRAM_SUPPORT_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border-4 border-black bg-blue-400 px-4 py-3 text-sm font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <Send className="h-4 w-4" strokeWidth={3} />
            Open Telegram
          </a>
        }
      >
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="border-4 border-black p-4">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-4">New ticket</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-black mb-2">Category</label>
                <select value={supportForm.category} onChange={(e) => setSupportForm((current) => ({ ...current, category: e.target.value }))} className="w-full border-4 border-black px-4 py-3 font-bold">
                  {['ORDER', 'PAYMENT', 'RESERVATION', 'ACCOUNT', 'TECHNICAL', 'FEEDBACK', 'OTHER'].map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </div>
              <Input label="Subject" value={supportForm.subject} onChange={(e) => setSupportForm((current) => ({ ...current, subject: e.target.value }))} />
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-black mb-2">Description</label>
                <textarea value={supportForm.description} onChange={(e) => setSupportForm((current) => ({ ...current, description: e.target.value }))} rows={6} className="w-full border-4 border-black px-4 py-3 font-bold outline-none" />
              </div>
              <Button onClick={handleCreateSupportTicket}><Send className="h-4 w-4 mr-2" />Send ticket</Button>
            </div>
          </div>

          <div className="border-4 border-black p-4">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Recent conversation</h3>
            {loadingSupport ? (
              <Loading />
            ) : tickets.length === 0 ? (
              <EmptyBlock text="No support tickets yet." />
            ) : (
              <div className="space-y-4">
                {tickets.slice(0, 4).map((ticket) => (
                  <div key={ticket.id} className="border-4 border-black p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-lg font-black uppercase tracking-tighter">{ticket.subject}</h4>
                          <StatusPill tone={ticket.status === 'RESOLVED' ? 'success' : 'warning'}>{ticket.status}</StatusPill>
                        </div>
                        <p className="mt-2 text-sm font-bold uppercase text-gray-600">{ticket.ticket_number} · {ticket.category}</p>
                      </div>
                      <StatusPill tone="default">{formatDateTime(ticket.created_at)}</StatusPill>
                    </div>
                    <p className="mt-4 text-sm font-bold">{ticket.description}</p>
                    <div className="mt-4 border-t-4 border-black pt-4">
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {(ticket.comments || []).map((comment) => (
                          <div key={comment.id} className={`border-2 border-black p-3 ${comment.is_staff_response ? 'bg-blue-50' : 'bg-gray-50'}`}>
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-xs font-black uppercase">{comment.user_name || comment.user_email || 'You'}</span>
                              <span className="text-[10px] font-black uppercase text-gray-500">{formatDateTime(comment.created_at)}</span>
                            </div>
                            <p className="mt-2 text-sm font-bold">{comment.comment}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-3">
                        <Input label="" placeholder="Write to support..." value={supportComment} onChange={(e) => setSupportComment(e.target.value)} />
                        <Button onClick={() => handleCommentSubmit(ticket.id)}><Send className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      <div className="border-4 border-black bg-yellow-400 p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5" strokeWidth={3} />
          <p className="font-black uppercase">Support links are available both inside the site chat and as a Telegram shortcut.</p>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboardPage;

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Inbox, Mail, MailOpen, Trash2, PlusCircle, Search, X } from 'lucide-react';
import { useGetMessagesQuery, useGetSentMessagesQuery, useDeleteMessageMutation, useSendMessageMutation } from '../../api/messageApi';
import { useGetUsersQuery } from '../../api/usersApi';
import useAuth from '../../hooks/useAuth';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { useUIStore } from '../../store/zustand/useUIStore';

const EMPTY = { recipientIds: [], subject: '', body: '', type: 'DIRECT' };

const MessageList = () => {
  const navigate = useNavigate();
  const { user, can } = useAuth();
  const addToast = useUIStore((s) => s.addToast);
  const openConfirm = useUIStore((s) => s.openConfirm);
  const [tab, setTab] = useState('inbox');
  const [composeOpen, setComposeOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [recipientSearch, setRecipientSearch] = useState('');

  const { data: inboxData, isLoading: inboxLoading } = useGetMessagesQuery();
  const { data: sentData, isLoading: sentLoading } = useGetSentMessagesQuery();
  const { data: usersRaw } = useGetUsersQuery();
  const allUsers = useMemo(() => usersRaw?.data || usersRaw || [], [usersRaw]);
  const [sendMessage] = useSendMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();

  const filteredUsers = useMemo(() => {
    const term = recipientSearch.toLowerCase();
    const selectedSet = new Set(form.recipientIds);
    return allUsers
      .filter((u) => u._id !== user?._id)
      .filter((u) => !selectedSet.has(u._id))
      .filter((u) => {
        if (!term) return true;
        const name = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
        const email = (u.email || '').toLowerCase();
        return name.includes(term) || email.includes(term);
      })
      .slice(0, 8);
  }, [allUsers, user, form.recipientIds, recipientSearch]);

  const addRecipient = (u) => {
    setForm((f) => ({ ...f, recipientIds: [...f.recipientIds, u._id] }));
    setRecipientSearch('');
  };

  const removeRecipient = (id) => {
    setForm((f) => ({ ...f, recipientIds: f.recipientIds.filter((r) => r !== id) }));
  };

  const getUser = (id) => allUsers.find((u) => u._id === id);

  const inbox = inboxData?.data || inboxData || [];
  const sent = sentData?.data || sentData || [];
  const messages = tab === 'inbox' ? inbox : sent;
  const isLoading = tab === 'inbox' ? inboxLoading : false;

  const isRead = (msg) => {
    if (tab === 'sent') return true;
    return msg.readBy?.some((r) => r.user === user?._id || r.user?._id === user?._id);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (form.recipientIds.length === 0) {
      addToast({ type: 'error', title: 'Please add at least one recipient' });
      return;
    }
    setSending(true);
    try {
      await sendMessage({
        recipients: form.recipientIds,
        subject: form.subject,
        body: form.body,
        type: form.type,
      }).unwrap();
      addToast({ type: 'success', title: 'Message sent' });
      setComposeOpen(false);
      setForm(EMPTY);
      setRecipientSearch('');
    } catch (err) {
      addToast({ type: 'error', title: 'Send failed', message: err.data?.message });
    } finally {
      setSending(false);
    }
  };

  const handleDelete = (msg) => {
    openConfirm({
      title: 'Delete Message',
      message: 'Are you sure you want to delete this message?',
      danger: true,
      onConfirm: async () => {
        try {
          await deleteMessage(msg._id).unwrap();
          addToast({ type: 'success', title: 'Message deleted' });
        } catch {
          addToast({ type: 'error', title: 'Delete failed' });
        }
      },
    });
  };

  const columns = [
    {
      key: 'read',
      header: '',
      headerClassName: 'w-8',
      className: 'w-8',
      render: (m) => isRead(m)
        ? <MailOpen className="h-4 w-4 text-gray-400" />
        : <Mail className="h-4 w-4 text-blue-600" />,
    },
    {
      key: 'from',
      header: tab === 'inbox' ? 'From' : 'To',
      render: (m) => {
        const person = tab === 'inbox' ? m.sender : m.recipients?.[0];
        const name = person ? `${person.firstName ?? ''} ${person.lastName ?? ''}`.trim() : '—';
        return (
          <span className={`text-sm ${isRead(m) ? 'text-gray-600' : 'font-semibold text-gray-900'}`}>
            {name}
          </span>
        );
      },
    },
    {
      key: 'subject',
      header: 'Subject',
      render: (m) => (
        <div
          className="cursor-pointer hover:text-blue-600"
          onClick={() => navigate(`/dashboard/messages/${m._id}`)}
        >
          <span className={`text-sm ${isRead(m) ? 'text-gray-700' : 'font-semibold text-gray-900'}`}>
            {m.subject || '(no subject)'}
          </span>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      className: 'text-gray-400 text-xs whitespace-nowrap',
      render: (m) => m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '—',
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (m) => (
        <button
          onClick={() => handleDelete(m)}
          className="p-1.5 text-red-400 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Messages"
        action={
          <Button onClick={() => setComposeOpen(true)} size="small">
            <PlusCircle className="h-4 w-4 mr-1.5" />
            Compose
          </Button>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setTab('inbox')}
          className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            tab === 'inbox' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Inbox className="h-4 w-4" /> Inbox
          {inbox.filter((m) => !isRead(m)).length > 0 && (
            <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
              {inbox.filter((m) => !isRead(m)).length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('sent')}
          className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            tab === 'sent' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Send className="h-4 w-4" /> Sent
        </button>
      </div>

      <DataTable
        columns={columns}
        data={messages}
        keyField="_id"
        isLoading={isLoading}
        emptyMessage={tab === 'inbox' ? 'No messages in your inbox.' : 'No sent messages.'}
        emptyIcon={<Mail className="h-12 w-12 opacity-30" />}
      />

      {/* Compose Modal */}
      <Modal
        isOpen={composeOpen}
        onClose={() => { setComposeOpen(false); setForm(EMPTY); setRecipientSearch(''); }}
        title="New Message"
        size="lg"
      >
        <form onSubmit={handleSend} className="space-y-4">
          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To *</label>
            {/* Chips */}
            {form.recipientIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {form.recipientIds.map((id) => {
                  const u = getUser(id);
                  const name = u ? `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email : id;
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-0.5 text-xs font-medium"
                    >
                      {name}
                      <button type="button" onClick={() => removeRecipient(id)} className="hover:text-blue-900">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                value={recipientSearch}
                onChange={(e) => setRecipientSearch(e.target.value)}
                placeholder="Search by name or email…"
                className="block w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {/* Dropdown results */}
            {recipientSearch && filteredUsers.length > 0 && (
              <ul className="mt-1 border border-gray-200 rounded-md overflow-hidden shadow-sm">
                {filteredUsers.map((u) => (
                  <li key={u._id}>
                    <button
                      type="button"
                      onClick={() => addRecipient(u)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center gap-2"
                    >
                      <span className="font-medium text-gray-900">
                        {u.firstName} {u.lastName}
                      </span>
                      <span className="text-gray-400 text-xs">{u.email}</span>
                      <span className="ml-auto text-xs text-gray-400 bg-gray-100 rounded px-1.5 py-0.5">
                        {u.role}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {recipientSearch && filteredUsers.length === 0 && (
              <p className="mt-1 text-xs text-gray-400">No users found.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              value={form.subject}
              onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
              placeholder="Message subject"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {can('messages', 'announce') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="DIRECT">Direct Message</option>
                <option value="ANNOUNCEMENT">Announcement</option>
                <option value="CIRCULAR">Circular</option>
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
              rows={5}
              required
              placeholder="Write your message..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setComposeOpen(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">
              Cancel
            </button>
            <button type="submit" disabled={sending} className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 flex items-center gap-2">
              <Send className="h-4 w-4" />
              {sending ? 'Sending…' : 'Send'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MessageList;

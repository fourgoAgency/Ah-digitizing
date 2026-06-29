"use client"

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { Bell, ChevronDown, Search } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { firestore, signOutUser, updateDocument } from '../../lib/firebase'
import { collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { useAuth } from '@/context/AuthProvider'

interface NotificationItem {
  id: string
  title: string
  time?: { toDate?: () => Date } | Date | string | number
  read?: boolean
}
function formatTimeAgo(time?: NotificationItem['time']) {
  if (!time) return 'Unknown'

  const date =
    typeof time === 'object' && time !== null && 'toDate' in time && typeof time.toDate === 'function'
      ? time.toDate()
      : time instanceof Date
      ? time
      : typeof time === 'number'
      ? new Date(time)
      : typeof time === 'string'
      ? new Date(time)
      : new Date()

  const diff = Date.now() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  if (seconds < 5) return 'Just now'
  if (seconds < 60) return `${seconds}s ago`

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`

  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks}w ago`

  return date.toLocaleDateString()
}

function getOneWeekAgoTimestamp() {
  return Date.now() - 7 * 24 * 60 * 60 * 1000
}

export default function Navbar({ unreadCount: unreadCountProp }: { unreadCount?: number }) {
  const [unread, setUnread] = useState<number>(0)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const router = useRouter()

  useEffect(() => {
    try {
      const q = query(
        collection(firestore, 'notifications'),
        where('time', '>=', getOneWeekAgoTimestamp()),
        orderBy('time', 'desc'),
        limit(50)
      )
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          setUnread(snapshot.docs.filter((doc) => !doc.data().read).length)
        },
        (err) => {
          console.error('Notifications listener error', err)
        }
      )

      return () => unsubscribe()
    } catch (err) {
      console.error('Failed to listen to notifications', err)
      return
    }
  }, [])

  useEffect(() => {
    try {
      const q = query(
        collection(firestore, 'notifications'),
        where('time', '>=', getOneWeekAgoTimestamp()),
        orderBy('time', 'desc'),
        limit(8)
      )
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          setNotifications(
            snapshot.docs.map((doc) => ({ ...(doc.data() as Omit<NotificationItem, 'id'>), id: doc.id }))
          )
        },
        (err) => {
          console.error('Notifications feed error', err)
        }
      )

      return () => unsubscribe()
    } catch (err) {
      console.error('Failed to load notifications', err)
      return
    }
  }, [])
  const handleLogout = async () => {
    try {
      await signOutUser()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
  const { adminUser, customUser } = useAuth()
  const displayCount = typeof unreadCountProp === 'number' ? unreadCountProp : unread
  const customUserRole = customUser?.role

  const roleLabel = useMemo(() => {
    if (adminUser) return 'Admin'
    if (customUserRole) {
      if (customUserRole === 'admin') return 'Admin'
      if (customUserRole === 'designer') return 'Designer'
      return customUserRole.charAt(0).toUpperCase() + customUserRole.slice(1)
    }
    return 'Guest'
  }, [adminUser, customUserRole])

  const notificationLabel = useMemo(
    () => (notifications.length === 0 ? 'No notifications yet' : `${notifications.length} recent notification${notifications.length === 1 ? '' : 's'}`),
    [notifications.length]
  )

  return (
    <div className='w-full h-16 bg-white border-b border-black flex items-center justify-between px-4'>
      <Image src="/logo.png" alt="Logo" width={120} height={120} />
      <div className='flex space-x-4'>
        <Button variant="ghost">
          <Search className="h-4 w-4" />
        </Button>
        <input type="text" placeholder="Search..." className="hidden md:block rounded-md px-auto py-1 focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <div className="flex justify-between items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="relative inline-flex items-center rounded-md p-2 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary">
              <Bell className="h-5 w-5" />
              {displayCount && displayCount > 0 ? (
                <span className="absolute -top-1 -right-2 bg-purple-500 text-white rounded-full text-[10px] w-5 h-5 flex items-center justify-center">
                  {displayCount > 99 ? '99+' : displayCount}
                </span>
              ) : null}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 p-2 bg-white">
            <DropdownMenuLabel className="text-sm font-semibold">Notifications</DropdownMenuLabel>
            <p className="text-xs text-muted-foreground mb-2 pl-2">{notificationLabel}</p>
            {notifications.length === 0 ? (
              <div className="rounded-md border border-border bg-muted px-3 py-4 text-sm text-muted-foreground">No notifications to show.</div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start gap-1 rounded-md px-3 py-3 hover:bg-slate-100"
                  onClick={async () => {
                    try {
                      await updateDocument('notifications', notification.id, { read: true })
                    } catch (err) {
                      console.error('Failed to mark notification as read', err)
                    }
                  }}
                >
                  <span className="font-medium text-sm text-foreground">{notification.title}</span>
                  <span className="text-xs text-muted-foreground">{formatTimeAgo(notification.time)}</span>
                </DropdownMenuItem>
              ))
            )}
            {notifications.length > 0 ? <DropdownMenuSeparator className="my-2" /> : null}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex justify-center items-center rounded-full overflow-hidden border border-black">
            <Image src="/150x150.png" alt="Profile" width={36} height={36} />
          </div>
          <span className="text-sm font-medium capitalize text-slate-900">{roleLabel}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

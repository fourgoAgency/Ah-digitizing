import 'server-only';

import { adminFirestore } from './firebaseAdmin';

export type NotificationEvent =
  | 'quote_submitted'
  | 'quote_assigned'
  | 'contact_received'
  | 'blog_published'
  | 'review_submitted'
  | 'order_placed'
  | 'order_completed'
  | 'order_assigned';

export interface NotificationData {
  title: string;
  description: string;
  type: NotificationEvent;
  relatedId?: string;
  relatedCollection?: string;
  data?: Record<string, unknown>;
}

export async function createNotification(notification: NotificationData): Promise<string | null> {
  if (!adminFirestore) {
    console.warn('Firebase Admin not initialized for notifications');
    return null;
  }

  try {
    const docRef = await adminFirestore.collection('notifications').add({
      title: notification.title,
      description: notification.description,
      type: notification.type,
      relatedId: notification.relatedId || null,
      relatedCollection: notification.relatedCollection || null,
      data: notification.data || {},
      read: false,
      time: Date.now(),
      createdAt: new Date().toISOString(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Failed to create notification:', error);
    return null;
  }
}

export async function createQuoteNotification(quoteId: string, email: string, orderType: string): Promise<void> {
  await createNotification({
    title: 'New Quote Request',
    description: `New ${orderType} quote request from ${email}`,
    type: 'quote_submitted',
    relatedId: quoteId,
    relatedCollection: 'quotes',
    data: { email, orderType },
  });
}

export async function createContactNotification(name: string, email: string, subject: string): Promise<void> {
  await createNotification({
    title: 'New Contact Form Submission',
    description: `${name} (${email}) submitted: ${subject}`,
    type: 'contact_received',
    data: { name, email, subject },
  });
}

export async function createBlogNotification(blogTitle: string, author?: string): Promise<void> {
  await createNotification({
    title: 'New Blog Post Published',
    description: `${blogTitle}${author ? ` by ${author}` : ''}`,
    type: 'blog_published',
    data: { blogTitle, author },
  });
}

export async function createReviewNotification(productName: string, rating: number): Promise<void> {
  await createNotification({
    title: 'New Review Submitted',
    description: `${rating}★ review for ${productName}`,
    type: 'review_submitted',
    data: { productName, rating },
  });
}

export async function createOrderNotification(orderId: string, customerEmail: string, orderType: string): Promise<void> {
  await createNotification({
    title: 'New Order Placed',
    description: `${orderType} order from ${customerEmail}`,
    type: 'order_placed',
    relatedId: orderId,
    relatedCollection: 'orders',
    data: { customerEmail, orderType },
  });
}

export async function createDesignerAssignmentNotification(designerName: string, orderType: string): Promise<void> {
  await createNotification({
    title: 'Order Assigned to Designer',
    description: `${orderType} order assigned to ${designerName}`,
    type: 'order_assigned',
    data: { designerName, orderType },
  });
}

export async function createOrderCompletionNotification(orderId: string, customerEmail: string): Promise<void> {
  await createNotification({
    title: 'Order Completed',
    description: `Order completed for ${customerEmail}`,
    type: 'order_completed',
    relatedId: orderId,
    relatedCollection: 'orders',
    data: { customerEmail },
  });
}

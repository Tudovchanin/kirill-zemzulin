import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Contact } from '~/types'
import { CONTACT_QUERY } from '~/queries/sanity.queries'

export const useContactStore = defineStore('contact', () => {
  const contact = ref<Contact | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const sanity = useSanity();
  async function fetchContact() {
    loading.value = true;
    error.value = null;
    try {
      
      contact.value = await sanity.fetch(CONTACT_QUERY) as Contact;

      

    } catch (e: unknown) {
      if (e instanceof Error) error.value = e.message
      else error.value =  String(e);
    } finally {
      loading.value = false;
    }
  }
  const mainSocialLinks = computed(() => {
    const socialLinks = {
      telegram: contact.value?.socialLinks?.find(link => link.platform === 'Telegram') || null,
      watsApp: contact.value?.socialLinks?.find(link => link.platform === 'WhatsApp') || null,
      vk: contact.value?.socialLinks?.find(link => link.platform === 'VK') || null,
      instagram: contact.value?.socialLinks?.find(link => link.platform === 'Instagram') || null
    }

    return socialLinks;
  })

  return {
    contact,
    loading,
    error,
    fetchContact,
    mainSocialLinks
  }
})

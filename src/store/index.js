import { createStore } from 'vuex';
import {doc, collection, getDocs, deleteDoc,  updateDoc } from "firebase/firestore";
import db from '@/firebase/firebaseInit';

export default createStore({
  state: {
    invoiceModal: null,
    modalActive: null,
    invoiceData: [],
    invoicesLoaded: null,
    currentInvoiceArray: null,

    editInvoice: null,
  },
  mutations: {
    TOGGLE_INVOICE(state){
      state.invoiceModal = !state.invoiceModal;
    },

    TOGGLE_MODAL(state){
      state.modalActive = !state.modalActive;
    },

    SET_INVOICE_DATA(state, payload){
      state.invoiceData.push(payload);
      console.log(state.invoiceData);
    },

    INVOICES_LOADED(state){
      state.invoicesLoaded = true;
    },

    SET_CURRENT_INVOICE(state, payload){
      state.currentInvoiceArray = state.invoiceData.filter(invoice => {
        return invoice.invoiceId === payload;
      })
    },

    TOGGLE_EDIT_INVOICE(state){
      state.editInvoice = !state.editInvoice;
    },

    DELETE_INVOICE(state, payload){
      state.invoiceData = state.invoiceData.filter(invoice => invoice.docId !== payload)
    },

    UPDATE_STATUS_TO_PAID(state, payload){
      state.invoiceData.forEach(invoice => {
        if(invoice.docId === payload){
          invoice.invoicePaid = true;
          invoice.invoicePending = false;
        }
      })
    },

    UPDATE_STATUS_TO_PENDING(state, payload){
      state.invoiceData.forEach(invoice => {
        if(invoice.docId === payload){
          invoice.invoicePaid = false;
          invoice.invoicePending = true;

          invoice.invoiceDraft = false;
        }
      })
    },
  },
  actions: {
    async GET_INVOICES({commit, state}){
      const getData = collection(db, 'invoices');
      const results = await getDocs(getData);

      console.log(results);
      results.forEach((doc) => {
        if(!state.invoiceData.some((invoice) => invoice.docId === doc.id)){
          const data = {
            docId: doc.id,
            invoiceId: doc.data().invoiceId,
            billerStreetAddress: doc.data().billerStreetAddress,
            billerCity: doc.data().billerCity,
            billerZipCode: doc.data().billerZipCode,
            billerCountry: doc.data().billerCountry,
            clientName: doc.data().clientName,
            clientEmail: doc.data().clientEmail,
            clientStreetAddress: doc.data().clientStreetAddress,
            clientCity: doc.data().clientCity,
            clientZipCode: doc.data().clientZipCode,
            clientCountry: doc.data().clientCountry,
            invoiceDateUnix: doc.data().invoiceDateUnix,
            invoiceDate: doc.data().invoiceDate,
            paymentTerms: doc.data().paymentTerms,
            paymentDueDateUnix: doc.data().paymentDueDateUnix,
            paymentDueDate: doc.data().paymentDueDate,
            productDescription: doc.data().productDescription,
            invoiceItemList: doc.data().invoiceItemList,
            invoiceTotal: doc.data().invoiceTotal,
            invoicePending: doc.data().invoicePending,
            invoiceDraft: doc.data().invoiceDraft, 
            invoicePaid: doc.data().invoicePaid,
          };

          commit('SET_INVOICE_DATA', data);
        }
      });

      commit('INVOICES_LOADED')
    },

    async UPDATE_INVOICE({commit, dispatch}, {docId, routeId}){
      commit('DELETE_INVOICE', docId);
      await dispatch('GET_INVOICES');
      commit('TOGGLE_INVOICE');
      commit('TOGGLE_EDIT_INVOICE');
      commit('SET_CURRENT_INVOICE', routeId);
    },

    async DELETE_INVOICE({commit}, docId){
      await deleteDoc(doc(db, "invoices", docId));

      commit('DELETE_INVOICE', docId)
    },

    async UPDATE_STATUS_TO_PAID({commit}, docId){
      await updateDoc(doc(db, "invoices", docId), {
        invoicePaid: true,
        invoicePending: false,
      });

      commit('UPDATE_STATUS_TO_PAID', docId);
    },

    async UPDATE_STATUS_TO_PENDING({commit}, docId){
      await updateDoc(doc(db, "invoices", docId), {
        invoicePaid: false,
        invoicePending: true,
        invoiceDraft: false,
      });

      commit('UPDATE_STATUS_TO_PENDING', docId);
    },
  },
  modules: {
  }
})

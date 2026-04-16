import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { FilePicker } from './src/components/FilePicker';
import { defaultSettings } from './src/config/defaultSettings';
import { buildInvoiceMessage, buildQuoteMessage } from './src/logic/messages';
import { calculateQuote } from './src/logic/pricing';
import { usePersistentState } from './src/state/usePersistentState';
import { FinanceRecord, JobCard, PricingSettings, PrintRequest } from './src/types';

const emptyRequest: PrintRequest = {
  clientName: '',
  clientEmail: '',
  projectTitle: '',
  materialId: defaultSettings.materials[0].id,
  colorCount: 1,
  estimatedGrams: 120,
  designHours: 0,
  shippingCost: 6,
  postProcessingFee: 0,
  stlLinks: '',
  notes: '',
  files: []
};

const asNumber = (value: string, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export default function App() {
  const [request, setRequest] = useState<PrintRequest>(emptyRequest);
  const [settings, setSettings] = usePersistentState<PricingSettings>('aq_settings', defaultSettings);
  const [jobs, setJobs] = usePersistentState<JobCard[]>('aq_jobs', []);
  const [finance, setFinance] = usePersistentState<FinanceRecord[]>('aq_finance', []);

  const preview = useMemo(() => calculateQuote(request, settings), [request, settings]);

  const addJobCard = () => {
    const job: JobCard = {
      id: `${Date.now()}`,
      request,
      breakdown: preview,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setJobs([job, ...jobs]);
    setRequest(emptyRequest);
  };

  const approveJob = (jobId: string) => {
    setJobs(
      jobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: 'approved'
            }
          : job
      )
    );
  };

  const generateQuote = (jobId: string) => {
    setJobs(
      jobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: 'quoted',
              quoteMessage: buildQuoteMessage(job)
            }
          : job
      )
    );
  };

  const generateInvoice = (jobId: string) => {
    setJobs(
      jobs.map((job) => {
        if (job.id !== jobId) {
          return job;
        }

        const updated = {
          ...job,
          status: 'invoiced' as const,
          invoiceMessage: buildInvoiceMessage(job)
        };

        setFinance([
          {
            jobId: updated.id,
            title: updated.request.projectTitle,
            total: updated.breakdown.total,
            materialGrams: updated.request.estimatedGrams,
            createdAt: new Date().toISOString()
          },
          ...finance
        ]);
        return updated;
      })
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.h1}>3D Print Auto-Quote + Invoicing</Text>

        <View style={styles.card}>
          <Text style={styles.h2}>Client Intake Form</Text>
          <Field label="Client Name" value={request.clientName} onChange={(value) => setRequest({ ...request, clientName: value })} />
          <Field label="Client Email" value={request.clientEmail} onChange={(value) => setRequest({ ...request, clientEmail: value })} />
          <Field
            label="Project Title"
            value={request.projectTitle}
            onChange={(value) => setRequest({ ...request, projectTitle: value })}
          />
          <Field
            label="STL Links"
            value={request.stlLinks}
            onChange={(value) => setRequest({ ...request, stlLinks: value })}
            multiline
          />
          <Field
            label="Notes"
            value={request.notes}
            onChange={(value) => setRequest({ ...request, notes: value })}
            multiline
          />

          <View style={styles.row}>
            <Field
              label="Estimated grams"
              value={String(request.estimatedGrams)}
              onChange={(value) => setRequest({ ...request, estimatedGrams: asNumber(value, 0) })}
              keyboardType="numeric"
            />
            <Field
              label="Color count"
              value={String(request.colorCount)}
              onChange={(value) => setRequest({ ...request, colorCount: asNumber(value, 1) })}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.row}>
            <Field
              label="Design hours"
              value={String(request.designHours)}
              onChange={(value) => setRequest({ ...request, designHours: asNumber(value, 0) })}
              keyboardType="numeric"
            />
            <Field
              label="Shipping cost"
              value={String(request.shippingCost)}
              onChange={(value) => setRequest({ ...request, shippingCost: asNumber(value, 0) })}
              keyboardType="numeric"
            />
          </View>

          <Field
            label="Post-processing fee"
            value={String(request.postProcessingFee)}
            onChange={(value) => setRequest({ ...request, postProcessingFee: asNumber(value, 0) })}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Material</Text>
          <View style={styles.pillRow}>
            {settings.materials.map((material) => (
              <Pressable
                key={material.id}
                style={[styles.pill, request.materialId === material.id && styles.pillActive]}
                onPress={() => setRequest({ ...request, materialId: material.id })}
              >
                <Text style={styles.pillText}>{material.label}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Upload STL/3D files</Text>
          <FilePicker onFilesSelected={(files) => setRequest({ ...request, files })} />
          {request.files.length > 0 && <Text style={styles.meta}>Files: {request.files.join(', ')}</Text>}

          <View style={styles.summaryBox}>
            <Text style={styles.h3}>Live Quote Preview: ${preview.total.toFixed(2)}</Text>
            <Text style={styles.meta}>Material ${preview.materialCost.toFixed(2)} • Design ${preview.designCost.toFixed(2)} • Shipping ${preview.shippingCost.toFixed(2)}</Text>
          </View>

          <Pressable style={styles.button} onPress={addJobCard}>
            <Text style={styles.buttonText}>Create Job Card</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.h2}>Pricing Settings</Text>
          <SettingField
            label="Machine hourly rate"
            value={settings.machineHourlyRate}
            onChange={(value) => setSettings({ ...settings, machineHourlyRate: value })}
          />
          <SettingField
            label="Default print hours"
            value={settings.estimatedPrintHours}
            onChange={(value) => setSettings({ ...settings, estimatedPrintHours: value })}
          />
          <SettingField
            label="Base labor fee"
            value={settings.baseLaborFee}
            onChange={(value) => setSettings({ ...settings, baseLaborFee: value })}
          />
          <SettingField
            label="Multi-color fee / extra color"
            value={settings.multicolorFeePerExtraColor}
            onChange={(value) => setSettings({ ...settings, multicolorFeePerExtraColor: value })}
          />
          <SettingField
            label="Design hourly rate"
            value={settings.designHourlyRate}
            onChange={(value) => setSettings({ ...settings, designHourlyRate: value })}
          />
          <SettingField
            label="Margin %"
            value={settings.serviceMarginPercent}
            onChange={(value) => setSettings({ ...settings, serviceMarginPercent: value })}
          />
          <SettingField
            label="Shipping markup %"
            value={settings.defaultShippingMarkupPercent}
            onChange={(value) => setSettings({ ...settings, defaultShippingMarkupPercent: value })}
          />
          <SettingField
            label="Tax %"
            value={settings.taxPercent}
            onChange={(value) => setSettings({ ...settings, taxPercent: value })}
          />
          <SettingField
            label="Minimum order"
            value={settings.minimumOrderAmount}
            onChange={(value) => setSettings({ ...settings, minimumOrderAmount: value })}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.h2}>Job Cards</Text>
          {jobs.length === 0 && <Text style={styles.meta}>No jobs yet.</Text>}
          {jobs.map((job) => (
            <View key={job.id} style={styles.jobCard}>
              <Text style={styles.h3}>{job.request.projectTitle || 'Untitled Project'}</Text>
              <Text style={styles.meta}>{job.request.clientName} • {job.status.toUpperCase()} • ${job.breakdown.total.toFixed(2)}</Text>

              <View style={styles.pillRow}>
                <Pressable style={styles.smallButton} onPress={() => approveJob(job.id)}>
                  <Text style={styles.buttonText}>Approve</Text>
                </Pressable>
                <Pressable style={styles.smallButton} onPress={() => generateQuote(job.id)}>
                  <Text style={styles.buttonText}>Generate Quote</Text>
                </Pressable>
                <Pressable style={styles.smallButton} onPress={() => generateInvoice(job.id)}>
                  <Text style={styles.buttonText}>Generate Invoice</Text>
                </Pressable>
              </View>

              {job.quoteMessage && <Text style={styles.message}>{job.quoteMessage}</Text>}
              {job.invoiceMessage && <Text style={styles.message}>{job.invoiceMessage}</Text>}
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.h2}>Finance + Material Snapshot</Text>
          <Text style={styles.meta}>Revenue: ${finance.reduce((sum, item) => sum + item.total, 0).toFixed(2)}</Text>
          <Text style={styles.meta}>Material used: {finance.reduce((sum, item) => sum + item.materialGrams, 0).toFixed(0)}g</Text>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  keyboardType?: 'default' | 'numeric';
  multiline?: boolean;
};

const Field = ({ label, value, onChange, keyboardType = 'default', multiline = false }: FieldProps) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.inputMultiline]}
      value={value}
      onChangeText={onChange}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={multiline ? 3 : 1}
    />
  </View>
);

type SettingFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

const SettingField = ({ label, value, onChange }: SettingFieldProps) => (
  <Field label={label} value={String(value)} onChange={(next) => onChange(asNumber(next, value))} keyboardType="numeric" />
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f4f6fb'
  },
  container: {
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#dce2f2'
  },
  h1: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2a44'
  },
  h2: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2a44'
  },
  h3: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2a44'
  },
  fieldWrap: {
    flex: 1,
    gap: 4
  },
  label: {
    fontWeight: '500',
    color: '#28344f'
  },
  input: {
    borderWidth: 1,
    borderColor: '#c7d0e5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fbfcff'
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top'
  },
  row: {
    flexDirection: 'row',
    gap: 8
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  pill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#97a8d0',
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  pillActive: {
    backgroundColor: '#dfe8ff'
  },
  pillText: {
    color: '#23345c'
  },
  summaryBox: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: '#eef3ff',
    padding: 10,
    gap: 4
  },
  button: {
    marginTop: 10,
    backgroundColor: '#355dcc',
    borderRadius: 8,
    alignItems: 'center',
    padding: 10
  },
  smallButton: {
    backgroundColor: '#355dcc',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  buttonText: {
    color: 'white',
    fontWeight: '600'
  },
  meta: {
    color: '#5c6a87'
  },
  jobCard: {
    borderWidth: 1,
    borderColor: '#d7deef',
    borderRadius: 10,
    padding: 10,
    gap: 8
  },
  message: {
    borderRadius: 8,
    backgroundColor: '#f7f9ff',
    borderWidth: 1,
    borderColor: '#e0e6f7',
    padding: 8,
    color: '#2b3c63'
  }
});


import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CloudLog } from "@/server/services/cloud-service" // Import type, but wait... frontend can't import server code directly usually? 
// Actually in this project structure server/services/cloud-service.ts is inside the project. 
// BUT importing from server/ might break if not configured.
// I should define the type locally or import from where it is shared.
// In use-dashboard-data.ts I imported it from '@/lib/cloud-service' which doesn't exist?
// Ah, checking use-dashboard-data.ts again.
// It imports `CloudLog` from `@/lib/cloud-service`. I should check that file.
// If it fails, I will define the schema independently.

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
    source_ip: z.string().min(7, "Invalid IP").max(15), // Simple length check for now, ideally Regex
    destination_ip: z.string().min(7, "Invalid IP").max(15),
    cloud_provider: z.enum(['AWS', 'AZURE', 'GCP']),
    protocol: z.enum(['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS']),
    action: z.enum(['ALLOW', 'DENY']),
    bytes: z.coerce.number().min(0),
    source_region: z.string().min(1, "Region required"),
    destination_region: z.string().min(1, "Region required"),
})

export type LogFormValues = z.infer<typeof formSchema>

interface LogDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialData?: any // CloudLog | null
    onSubmit: (values: LogFormValues) => Promise<void>
}

export function LogDialog({ open, onOpenChange, initialData, onSubmit }: LogDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<LogFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            source_ip: "",
            destination_ip: "",
            cloud_provider: "AWS",
            protocol: "TCP",
            action: "ALLOW",
            bytes: 0,
            source_region: "us-east-1",
            destination_region: "us-west-2",
        },
    })

    // Reset form when dialog opens/closes or data changes
    useEffect(() => {
        if (open) {
            if (initialData) {
                form.reset({
                    source_ip: initialData.source_ip,
                    destination_ip: initialData.destination_ip,
                    cloud_provider: initialData.cloud_provider,
                    protocol: initialData.protocol,
                    action: initialData.action,
                    bytes: initialData.bytes,
                    source_region: initialData.source_region,
                    destination_region: initialData.destination_region,
                })
            } else {
                form.reset({
                    source_ip: "",
                    destination_ip: "",
                    cloud_provider: "AWS",
                    protocol: "TCP",
                    action: "ALLOW",
                    bytes: 0,
                    source_region: "us-east-1",
                    destination_region: "us-west-2",
                })
            }
        }
    }, [open, initialData, form])

    async function handleSubmit(values: LogFormValues) {
        setIsSubmitting(true)
        try {
            await onSubmit(values)
            onOpenChange(false)
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Traffic Event" : "Add Traffic Event"}</DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? "Make changes to the network traffic log here."
                            : "Create a new network traffic log entry."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="cloud_provider"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Provider</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select provider" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="AWS">AWS</SelectItem>
                                                <SelectItem value="AZURE">Azure</SelectItem>
                                                <SelectItem value="GCP">GCP</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="protocol"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Protocol</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select protocol" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="TCP">TCP</SelectItem>
                                                <SelectItem value="UDP">UDP</SelectItem>
                                                <SelectItem value="HTTP">HTTP</SelectItem>
                                                <SelectItem value="HTTPS">HTTPS</SelectItem>
                                                <SelectItem value="ICMP">ICMP</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="source_ip"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Source IP</FormLabel>
                                        <FormControl>
                                            <Input placeholder="192.168.1.1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="destination_ip"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Destination IP</FormLabel>
                                        <FormControl>
                                            <Input placeholder="10.0.0.1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="source_region"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Source Region</FormLabel>
                                        <FormControl>
                                            <Input placeholder="us-east-1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="destination_region"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dest Region</FormLabel>
                                        <FormControl>
                                            <Input placeholder="us-west-2" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="action"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Action</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select action" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="ALLOW">Allow</SelectItem>
                                                <SelectItem value="DENY">Deny</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bytes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bytes</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {initialData ? "Update Event" : "Create Event"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

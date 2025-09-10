"use client";

import { useEffect, useState } from "react";
import { Table, Switch, message, Button, Modal, Image } from "antd";

interface Resource {
    id: string;
    name: string;
    path: string;
    enabled: boolean;
}

export default function ResourcePage() {
    const [data, setData] = useState<Resource[]>([]);
    const [loadingIds, setLoadingIds] = useState<string[]>([]);
    const [preview, setPreview] = useState<Resource | null>(null);

    useEffect(() => {
        fetch("/api/resources")
            .then((res) => res.json())
            .then(setData);
    }, []);

    const toggleEnabled = async (record: Resource, checked: boolean) => {
        setLoadingIds((prev) => [...prev, record.id]);

        try {
            const res = await fetch(`/api/resources/${record.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ enabled: checked }),
            });

            if (!res.ok) throw new Error("更新失败");

            message.success("更新成功");
            setData((prev) =>
                prev.map((r) =>
                    r.id === record.id ? { ...r, enabled: checked } : r
                )
            );
        } catch (err) {
            console.error(err);
            message.error("更新失败，请重试");
        } finally {
            setLoadingIds((prev) => prev.filter((id) => id !== record.id));
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <Table
                dataSource={data}
                rowKey="id"
                columns={[
                    { title: "id", dataIndex: "id" },
                    { title: "资源名", dataIndex: "name" },
                    { title: "路径", dataIndex: "path" },
                    {
                        title: "是否可访问",
                        dataIndex: "enabled",
                        render: (_, record) => (
                            <Switch
                                checked={record.enabled}
                                loading={loadingIds.includes(record.id)}
                                onChange={(checked) => toggleEnabled(record, checked)}
                            />
                        ),
                    },
                    {
                        title: "操作",
                        render: (_, record) => (
                            <Button
                                type="link"
                                onClick={() => setPreview(record)}
                                disabled={!record.enabled} // 如果禁用则不允许预览
                            >
                                预览
                            </Button>
                        ),
                    },
                ]}
            />

            {/* 弹出框预览 */}
            <Modal
                open={!!preview}
                title={preview?.name}
                footer={null}
                onCancel={() => setPreview(null)}
                width={600}
            >
                {preview && (
                    <div style={{ textAlign: "center" }}>
                        <Image
                            src={`/api/resource${preview.path.replace("/assets", "")}`}
                            alt={preview.name}
                            style={{ maxHeight: "400px", objectFit: "contain" }}
                        />
                    </div>
                )}
            </Modal>
        </div>
    );
}

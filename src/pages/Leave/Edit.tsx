import LeaveForm from "@/components/forms/LeaveForm";
import { leaveService } from "@/services/leaveService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { CreateLeaveInputs } from "@/schema/leave";
import Loader from "@/components/ui/Loader";

const LeaveEdit = () => {
    const { id } = useParams();
    const [leaveData, setLeaveData] = useState<CreateLeaveInputs | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeave = async () => {
            if (id) {
                try {
                    const response = await leaveService.getLeaveByCode(id);
                    if (response && response.isSuccess) {
                        setLeaveData(response.data);
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchLeave();
    }, [id]);

    if (loading) {
        return <Loader loading={loading} />;
    }

    if (!leaveData) {
        console.log(leaveData);
        return <div>Leave not found</div>;
    }

    return (
        <LeaveForm id={id} isEditMode={true} data={leaveData} />
    );
};

export default LeaveEdit;
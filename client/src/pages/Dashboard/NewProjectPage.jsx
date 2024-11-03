import DashboardLayout from '../../components/layout/DashboardLayout';
import ProjectWizard from '../../components/wizard/ProjectWizard';

const NewProjectPage = () => {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
        <p className="mt-1 text-sm text-gray-500">
          Follow the steps to set up your Shopee business
        </p>
      </div>
      <div className="mt-8">
        <ProjectWizard />
      </div>
    </DashboardLayout>
  );
};

export default NewProjectPage;
export function formatUserSummary(data) {
  const workCounts = {
    work1: 0,
    work2: 0,
    work3: 0,
  };

  data.workCountsAgg.forEach((item) => {
    if (workCounts[item._id] !== undefined) {
      workCounts[item._id] = item.count;
    }
  });

  const totalAssigned =
    workCounts.work1 + workCounts.work2 + workCounts.work3;

  const unAssignedUsers = data.totalUsers - totalAssigned;

  return {
    totalUsers: data.totalUsers,
    workCounts,
    unAssignedUsers,
  };
}

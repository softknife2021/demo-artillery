package com.softknife.testng.listener;

import com.softknife.config.DemoTestConfig;
import com.softknife.resources.DemoTestConfigResourceProvider;
import com.softknife.testng.StatusSender;
import com.softknife.testng.model.TestCaseStatus;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.ITestContext;
import org.testng.ITestListener;
import org.testng.ITestResult;

import java.lang.invoke.MethodHandles;
import java.time.LocalDateTime;

public class ElasticSearchListener implements ITestListener {

    private TestCaseStatus testCaseStatus;
    private static final Logger logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private DemoTestConfig config = DemoTestConfigResourceProvider.getInstance().getGlobalConfig();

    public void onTestStart(ITestResult iTestResult) {
        logger.info("Test started:{}", iTestResult.getMethod().getMethodName());
        this.testCaseStatus = new TestCaseStatus();

    }


    public void onTestSuccess(ITestResult iTestResult) {
        this.sendStatus(iTestResult,"PASS");
    }

    public void onTestFailure(ITestResult iTestResult) {
        this.sendStatus(iTestResult,"FAIL");
    }

    public void onTestSkipped(ITestResult iTestResult) {
        this.sendStatus(iTestResult,"SKIPPED");
    }

    public void onTestFailedButWithinSuccessPercentage(ITestResult iTestResult) {
        //skip
    }

    public void onStart(ITestContext iTestContext) {
        //skip
    }

    public void onFinish(ITestContext iTestContext) {
        logger.info("Test Finished: {}", iTestContext.getName());
    }

    private void sendStatus(ITestResult iTestResult, String status){
        if(config.sendResultElastic()){
            this.testCaseStatus.setGroup(StringUtils.join(iTestResult.getMethod().getGroups(), ","));
            this.testCaseStatus.setTestClass(iTestResult.getTestClass().getName());
            this.testCaseStatus.setDescription(iTestResult.getMethod().getDescription());
            this.testCaseStatus.setStatus(status);
            this.testCaseStatus.setTestName(iTestResult.getTestName());
            this.testCaseStatus.setExecutionTime(LocalDateTime.now().toString());
            this.testCaseStatus.setTestName(iTestResult.getName());
            this.testCaseStatus.setEnv(DemoTestConfigResourceProvider.getInstance().getGlobalConfig().env());
            if(iTestResult.getTestContext().getIncludedGroups().length > 0){
                this.testCaseStatus.setGroup( StringUtils.join(iTestResult.getTestContext().getIncludedGroups(), ' '));
            }
            if(iTestResult.getParameters().length > 0){
                this.testCaseStatus.setParameters(iTestResult.getParameters()[0].toString());
            }
            if(status.equalsIgnoreCase("FAIL")){
                this.testCaseStatus.setError(iTestResult.getThrowable().getLocalizedMessage());
            }
            if(StringUtils.isNotBlank(config.buildId())){
                this.testCaseStatus.setBuildUrl(config.buildUrl());
                this.testCaseStatus.setBuildJobName(config.buildJobName());
                this.testCaseStatus.setBuildId(config.buildId());
            }
            StatusSender.send(this.testCaseStatus);
        }
        else {
            logger.info("Elastic test case result sends it turned off");
        }
    }


}

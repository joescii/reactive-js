name := "reactive-js"

version := "0.0.1"

organization := "com.joescii"

scalaVersion := "2.10.4"

resolvers ++= Seq(
  "snapshots" at "https://oss.sonatype.org/content/repositories/snapshots",
  "releases"  at "https://oss.sonatype.org/content/repositories/releases"
)

seq(webSettings :_*)

unmanagedResourceDirectories in Test <+= (baseDirectory) { _ / "src/main/webapp" }

scalacOptions ++= Seq("-deprecation", "-unchecked")

libraryDependencies ++= {
  val liftVersion = "2.6-RC1"
  val liftEdition = liftVersion.substring(0,3)
  Seq(
    "net.liftweb"       %% "lift-webkit"        % liftVersion        % "compile",
    "net.liftmodules"   %% ("lift-jquery-module_"+liftEdition) % "2.8" % "compile",
    "net.liftmodules"   %% ("ng-js_"+liftEdition) % "0.2_1.3.0"        % "compile",
    "net.liftmodules"   %% ("ng_"+liftEdition)    % "0.5.6"            % "compile",
    "net.databinder.dispatch" %% "dispatch-core"  % "0.11.2"           % "compile", // http://dispatch.databinder.net/Dispatch.html
    "org.eclipse.jetty" % "jetty-webapp"        % "8.1.7.v20120910"  % "container,test",
    "org.eclipse.jetty.orbit" % "javax.servlet" % "3.0.0.v201112011016" % "container,test" artifacts Artifact("javax.servlet", "jar", "jar"),
    "ch.qos.logback"    % "logback-classic"     % "1.0.6",
    "org.specs2"        %% "specs2"             % "1.14"            % "test"
  )
}

